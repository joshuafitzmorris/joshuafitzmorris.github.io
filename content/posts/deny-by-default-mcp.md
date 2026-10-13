An MCP server is an API whose caller does what it reads. The caller is a model acting for a signed-in user, and it takes instructions from that user, from every document it opens, and from whatever your own tools hand back. Give it a tool that fetches an invoice by id and it will fetch any id it is given, including one it found in a pasted email or one a document told it to try.

Security people have a name for this that predates LLMs: the confused deputy. A program holds authority, and someone else gets to decide how it is used. The model holds the user's authority. Prompt injection is the someone else.

I built tool access for a multi-tenant document platform: one MCP server, 40 tools, many customers' documents behind it. What follows is the pattern I ended up with. I rebuilt it from scratch on fake data as a [reference repo](https://github.com/joshuafitzmorris/mcp-scoped-server): two invented companies, eight tools, the tests, and a small eval harness.

## The model never chooses whose data it touches

Most of the work is done by one decision: no tool takes a tenant id as an argument. The tenant comes from the verified access token, and each tool receives a view of the data that is already narrowed to that tenant:

```python
@tool(scopes=["invoices:read"])
def get_invoice(view: TenantView, invoice_id: str) -> Invoice:
    invoice = view.invoice(invoice_id)
    if invoice is None:
        raise NotFound("invoice not found")
    return invoice
```

The model controls `invoice_id`, and it can pass any string it likes. If the id belongs to another tenant, the view doesn't have it, and the caller gets the same error a typo gets. A tool that answers "that invoice belongs to another organisation" has told the caller the id exists, which is a small leak on its own.

The view is the only data handle a tool gets. It filters before it returns anything and it hands out copies, so a tool can't change a stored row by mutating what it was given.

## Every tool declares its scopes, or it doesn't ship

Scopes are declared on the decorator, and the declaration is required. Leaving it out is a TypeError at import. An empty list is refused as well, because `scopes=[]` is what someone types to make the error go away.

The server checks again when it starts. If any tool reached the MCP server without going through the registry, it refuses to start. A middleware checks a third time on every call, before the SDK has validated the arguments, so a tool added some other way at run time still can't be called.

Three checks for one rule can look like overkill. Each covers a different way in: a health-check tool that someone in a hurry adds straight onto the server object never passes the decorator, so the start-up check is what catches it.

The same declarations drive the tool list. A user without `invoices:write` never sees the tool that marks an invoice paid, which saves the model from planning around something it can't use. The call path checks scopes whether or not the tool was listed.

## The CI test

Scope checks at run time decide whether a tool may run. They can't tell whether the tool's own code leaks once it does. In production, the check that mattered most was a CI test that failed the build for any tool touching client data without a scope check. The reference repo has that test, in three parts.

The first two are simple. Every tool on the server came through the registry with scopes from the catalog. No module that defines a tool imports the raw data store or reaches into a private attribute to get past the view.

The third goes further than what I ran in production. For every tool, for each tenant, and for a sweep of arguments generated from the tool's type hints, it runs the call twice: once against the full dataset, and once against a copy that holds only the caller's tenant. The two results must be identical, and none of the other tenant's rows may have changed. The property has a name in the security literature, noninterference: what one tenant sees can't depend on another tenant's data.

The check doesn't depend on how the tool was written. A list that lost its filter fails, and so does a total that sums every tenant's invoices, which a check scanning results for foreign records would miss because a sum carries no ids. The "belongs to another organisation" error from earlier fails too, since the full run and the single-tenant run return different errors, and so does a write that lands on another tenant's row. When the shared data layer regresses, every tool that reads through it fails at once.

Eight tools and about two hundred argument combinations per tenant run in well under a second. The sweep denies by default too: a parameter type it can't generate values for fails the test with a note to add some, so a tool that takes a free-form dict doesn't get to skip the check.

The repo has a branch with two broken tools on it: a dashboard total that reaches past the view, and a health check registered straight on the server. The server refuses to start, and the contract step fails three ways, each pointing at the line or the tool. The dashboard total returns a number labelled with the right tenant, so nothing at run time objects; only the comparison against a single-tenant copy shows the number is wrong.

## What it doesn't catch

- It only varies the data it hands the tool. A tool that reads a module-level copy of the data passes, because both runs see the same leak. The import check catches the obvious version, and the repo has a test that pins this blind spot so nobody mistakes it for coverage.
- It only tries the arguments in the sweep. A leak that needs an input it never generated gets through.
- It doesn't check whether a declared scope is the right one. A write tool declared as read-only passes, and catching that is left to review.
- It says nothing about permissions between users inside one tenant.
- The import check is a lint for honest mistakes. Anyone determined can get around it.

In production the database should hold the same line as well, with row-level security keyed on the tenant, so a raw query from a tool can't cross it either.

## Auth, briefly

The MCP server is an OAuth 2.1 resource server. The repo includes a small test authorization server so the whole flow runs on a laptop and in CI: authorization code with PKCE (S256 only), single-use codes, exact redirect URI matching, and the `resource` parameter from RFC 8707, so each token's audience is one MCP server.

The server refuses a token minted for any other audience. The MCP spec forbids token passthrough, where a token issued for one service is replayed against another, and checking the audience on every request is what stops it. The tenant claim travels in the same signed token, which is why the model can't change it.

## Evals

The repo also has a small eval harness: eleven hand-written questions with expected tool calls and results, plus a scan of every tool output and answer for another tenant's ids or text. CI fails the build on a leak and only reports accuracy. A leak is wrong at a sample size of one. An accuracy number from eleven cases moves nine points when one case flips.

Four of the eleven are held out. The baseline agent in the repo is a keyword router I wrote by reading the seven dev cases. It passes all seven, and two of the four held-out cases, which ask for the same things in other words.

## If you're doing this yourself

The order I'd do it in: take the tenant out of the tool arguments, make the scope declaration required, then write the noninterference test before the tenth tool, while a failure still points at one obvious tool.

The code is small enough to read in one sitting: [mcp-scoped-server](https://github.com/joshuafitzmorris/mcp-scoped-server).
