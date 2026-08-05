/**
 * Single source of truth for every word on the site.
 *
 * Facts here are kept in sync with the master resume
 * (`public/Joshua_FitzMorris_Resume.pdf`) and linkedin.com/in/jfitzmor.
 * Metrics are measured numbers from shipped work, never estimates.
 */

export const person = {
  name: "Joshua Fitz-Morris",
  role: "Lead Software Engineer",
  headline:
    "Production AI Platforms, Agents & Document Intelligence · Python, FastAPI, React/TypeScript, Gemini, MCP · GCP/AWS",
  location: "Vancouver, BC",
  availability: "Remote Canada / US · TN-eligible",
  email: "joshuafitzmorris09@gmail.com",
  linkedin: "https://www.linkedin.com/in/jfitzmor",
  linkedinLabel: "linkedin.com/in/jfitzmor",
  resume: "/Joshua_FitzMorris_Resume.pdf",
  // Swap to https://joshuafitzmorris.ca once that domain resolves again, and
  // add a CNAME file to public/. The canonical tag, sitemap, and Open Graph
  // image URL are all built from this.
  siteUrl: "https://joshuafitzmorris.github.io",
} as const;

/**
 * A display line, split so the italic gesture is explicit. Authored copy may
 * italicize its one key word; nothing infers italics from markup in a string.
 */
export type DisplayPart = { text: string; em?: boolean };

const heroDisplay: DisplayPart[] = [
  { text: "Production AI systems, " },
  { text: "owned", em: true },
  { text: " end to end." },
];

export const hero = {
  eyebrow: "Lead Software Engineer",
  display: heroDisplay,
  lede:
    "For the last five years I have built full-stack, cloud, and AI systems for enterprise clients out of a Vancouver consultancy. Most recently as the sole code owner of a seven-service document intelligence and agent platform, taken from an empty repository to live production in 28 weeks.",
} as const;

/** The proof line. Bare numbers on the field, no boxes. */
export const metrics = [
  { value: "28", unit: "weeks", label: "Inception to live production" },
  { value: "429", unit: "PRs", label: "Merged as sole CODEOWNER" },
  { value: "37→99", unit: "%", label: "Extraction recall, eval driven" },
  { value: "26k", unit: "docs", label: "Under semantic retrieval" },
  { value: "40", unit: "tools", label: "Governed MCP agent layer" },
] as const;

export type Project = {
  slug: string;
  name: string;
  kind: string;
  org: string;
  period: string;
  /** One sentence. What it is, in plain language. */
  summary: string;
  /** The part worth reading. */
  body: string[];
  outcomes: { value: string; label: string }[];
  stack: string[];
  /** Anchors the section's watercolor splash. */
  palette: "warm" | "calm" | "dusk" | "dawn";
};

export const work: Project[] = [
  {
    slug: "capri",
    name: "ACERO / Capri",
    kind: "AI document intelligence & agent platform",
    org: "Ollon",
    period: "2026",
    summary:
      "A seven-service, three-environment platform that reads a company's paperwork, extracts it under evaluation, puts a human on the uncertain calls, and delivers the result to a system of record.",
    body: [
      "I was the primary technical owner and sole repository CODEOWNER, from the first commit to production traffic in 28 weeks across 429 merged pull requests.",
      "The core is multi-tenant ingestion of PDF, XLSX, and Google Sheets through Gemini extraction, confidence scoring, human review, and system-of-record delivery. Fourteen of fourteen validated production pushes landed with zero orphaned records, which is the number I care about most: the pipeline either delivers a complete job or it delivers nothing.",
      "Extraction quality was treated as an engineering problem rather than a prompt problem. A golden-data evaluation harness moved quantity recall from 37% to 99%, and reached 96.3% precision at 91% coverage on a taxonomy mapping field that had resisted every heuristic before it.",
      "On top of that sits semantic retrieval across 26,000 historical documents at 99.98% embedding coverage, and a governed MCP and agent architecture: 40 tools and 21 BI views, with tenant and principal isolation, audited queries, and answers grounded in a cited source.",
      "The unglamorous half was making it a good place to work. CI runtime came down 52%, and the local unit test loop went from 10.5 minutes to 15.6 seconds.",
    ],
    outcomes: [
      { value: "28 weeks", label: "Inception to production" },
      { value: "14 / 14", label: "Clean production pushes" },
      { value: "96.3%", label: "Precision at 91% coverage" },
      { value: "15.6s", label: "Unit test loop, from 10.5 min" },
    ],
    stack: [
      "GCP",
      "Python",
      "FastAPI",
      "React",
      "TypeScript",
      "Gemini",
      "MCP",
      "PostgreSQL / pgvector",
      "BigQuery",
      "Cloud Run",
      "Terraform",
    ],
    palette: "warm",
  },
  {
    slug: "stellantis",
    name: "Stellantis",
    kind: "AI contract intelligence",
    org: "Ollon",
    period: "2025",
    summary:
      "A retrieval pipeline over a vendor contract portfolio, plus the agent surface that let people actually ask it things.",
    body: [
      "Over a thousand vendor contracts ingested and indexed into a vector searchable knowledge base, cutting contract search time by 90%.",
      "I built the MCP server that exposed semantic search and natural language querying over the corpus, along with automated portfolio reporting across spend, obligations, and risk exposure.",
    ],
    outcomes: [
      { value: "1,000+", label: "Contracts indexed" },
      { value: "90%", label: "Reduction in search time" },
    ],
    stack: [
      "GCP",
      "Python",
      "RAG",
      "Vector embeddings",
      "Document AI",
      "Terraform",
      "PostgreSQL / pgvector",
    ],
    palette: "calm",
  },
  {
    slug: "green-spiegel",
    name: "Green & Spiegel LLP",
    kind: "Immigration case management platform",
    org: "Ollon",
    period: "2024 – 2025",
    summary:
      "A multi-tenant platform for global immigration law firms, delivered as tech lead on a five-person team.",
    body: [
      "A $1M+ engagement where I led the team and owned the architecture through launch.",
      "The piece that changed the client's economics was a schema-driven dynamic form engine: non-technical staff design their own intake workflows, without an engineer in the loop. It removed hundreds of hours of manual legal review a month.",
    ],
    outcomes: [
      { value: "$1M+", label: "Engagement, led end to end" },
      { value: "5", label: "Engineers led" },
    ],
    stack: [
      "React",
      "Express",
      "MSSQL",
      "Docker",
      "AWS ECS",
      "S3",
      "CloudFront",
      "WAF",
      "Cypress",
    ],
    palette: "dusk",
  },
];

/** Folded into a hairline list rather than given full entries. */
export const alsoBuilt = [
  {
    client: "Knighthead Capital",
    detail:
      "Governed reinsurance treaty workflows and a secure Next.js data layer for underwriting.",
  },
  {
    client: "Credit Suisse",
    detail: "Okta and Azure AD single sign-on rollout across 1,000+ users.",
  },
  {
    client: "Sinalite",
    detail: "Terraform-driven multi-region AWS migration.",
  },
  {
    client: "APR",
    detail:
      "Workflow automation with Document AI extraction and conversational BI over BigQuery.",
  },
];

export type SideProject = {
  name: string;
  tagline: string;
  status: string;
  body: string[];
  /** A line lifted verbatim from the project's own constitution. */
  quote: string;
  quoteSource: string;
  stack: string[];
  palette: "warm" | "calm" | "dusk" | "dawn";
};

export const building: SideProject[] = [
  {
    name: "KitchenOS",
    tagline: "Stop wasting the food you already bought.",
    status: "v0 on device",
    body: [
      "An operating system keeps state so the programs do not have to. KitchenOS keeps the state of a kitchen: what is there, what is dying, and what is possible tonight.",
      "Every app that attacked food waste asked people to become inventory clerks, and every one of them died of that ask. Multimodal models changed the physics. A camera glance can read a fridge now, and a spoken sentence can update it. The bet is that a fuzzy, confidence-scored, staleness-tolerant picture of a fridge is sustainable where exact bookkeeping never was.",
      "Native SwiftUI with a WidgetKit face on the Home and Lock Screen, on-device SwiftData, and three narrow agent surfaces: vision inventory inference, voice delta parsing, and constrained recipe generation. The design constitution is its own document, and the simulator is the source of truth for what the app is.",
    ],
    quote: "Fuzzy and alive beats precise and abandoned.",
    quoteSource: "The KitchenOS core bet",
    stack: [
      "Swift",
      "SwiftUI",
      "SwiftData",
      "WidgetKit",
      "Gemini vision",
      "XcodeGen",
    ],
    palette: "dawn",
  },
  {
    name: "Manifest",
    tagline: "Meet your data where it lives, and make it make sense.",
    status: "Pre-v0, first slice live",
    body: [
      "Manifest turns the documents a company already receives, invoices and receipts and POs and job paperwork, into organized files and normalized records in that company's own vocabulary: their jobs, their vendors, their cost types.",
      "The bet is that it is configurable without developers. Taxonomies do not transfer between companies, and that is the point. An admin brings their own vocabulary and the engine stays constant. Every human correction becomes remembered mapping, which is the part a generic PDF-to-JSON tool cannot copy.",
      "The first vertical slice runs intake, extraction, and normalization across three deliberately different company shapes at once, because forcing three taxonomies through one engine from day one is the only honest proof of the one-engine bet. Verifying a document in the review surface mints an eval expectation, so the review queue doubles as the accuracy corpus.",
    ],
    quote:
      "Manifest demonstrates intelligence by having already done the work, not by narrating that it is working.",
    quoteSource: "The Manifest design principles",
    stack: [
      "TypeScript",
      "pnpm workspaces",
      "Multimodal extraction",
      "Eval harness",
      "MCP",
    ],
    palette: "calm",
  },
];

/** Drawn from the engineering constitutions I actually work to. */
export const principles = [
  {
    title: "Evidence over vibes",
    body: "A trust claim ships with the measured run behind it. If accuracy cannot be stated as a number from a real eval, it does not go in the deck.",
  },
  {
    title: "Demonstrated, not merged",
    body: "A behavior exists when someone has watched it work on the real device or the real environment. Merged code is a claim, not a result.",
  },
  {
    title: "Plain code by default",
    body: "Agents earn their place against the boring alternative. Where a function will do, a function does it, and the model handles the part that genuinely needs judgment.",
  },
  {
    title: "Never guess silently",
    body: "Below the confidence bar, the system asks. One wrong silent record costs more trust than ten honest questions, and every automatic decision carries its evidence and a one-click correction.",
  },
];

export const stack = [
  {
    group: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "Swift", "SQL"],
  },
  {
    group: "AI & LLM",
    items: [
      "RAG",
      "Agentic systems",
      "MCP",
      "Evals & golden data",
      "Gemini",
      "Embeddings",
      "pgvector",
      "Prompt & schema pipelines",
    ],
  },
  {
    group: "Backend & frontend",
    items: ["FastAPI", "Node.js", "Express", "React", "Next.js", "Tailwind", "Cypress"],
  },
  {
    group: "Cloud & data",
    items: [
      "GCP (Cloud Run, BigQuery, Pub/Sub, Document AI)",
      "AWS (ECS, S3, RDS)",
      "Terraform",
      "Docker",
      "PostgreSQL",
      "MySQL",
      "MSSQL",
    ],
  },
  {
    group: "Identity & security",
    items: ["OAuth 2.1 / PKCE", "OIDC", "SAML", "Okta", "Azure AD"],
  },
];

export const credentials = [
  {
    title: "BSc Computer Science",
    org: "Simon Fraser University",
    period: "2021",
  },
  {
    title: "AWS Certified Solutions Architect, Associate",
    org: "Amazon Web Services",
    period: "2025 – 2028",
  },
];

const contactDisplay: DisplayPart[] = [
  { text: "Building something that needs to " },
  { text: "actually", em: true },
  { text: " work?" },
];

export const contact = {
  display: contactDisplay,
  lede: "I am open to senior, staff, and forward deployed engineering roles, and to selected contract work. Production AI, retrieval, document intelligence, agents, and the platform underneath them.",
} as const;

export const sections = [
  { id: "work", label: "Work" },
  { id: "building", label: "Building" },
  { id: "approach", label: "Approach" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
] as const;
