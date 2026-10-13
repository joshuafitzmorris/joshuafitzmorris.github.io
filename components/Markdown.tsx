import type { ReactNode } from "react";

/**
 * A deliberately small Markdown renderer for the posts in content/posts.
 *
 * It handles what the posts use and nothing more: `##` and `###` headings,
 * paragraphs, `-` lists, fenced code, inline code, and links. Anything else
 * renders as plain text, which is the safe failure for a static site. A new
 * construct in a post means a new case here, on purpose, rather than a
 * Markdown dependency for one page.
 */

type Block =
  | { kind: "h2" | "h3" | "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "code"; lang: string; text: string };

export function parse(source: string): Block[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: string[] | null = null;

  const endParagraph = () => {
    if (paragraph.length) blocks.push({ kind: "p", text: paragraph.join(" ") });
    paragraph = [];
  };
  const endList = () => {
    if (list) blocks.push({ kind: "ul", items: list });
    list = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      endParagraph();
      endList();
      const body: string[] = [];
      for (i++; i < lines.length && !/^```\s*$/.test(lines[i]); i++) body.push(lines[i]);
      blocks.push({ kind: "code", lang: fence[1], text: body.join("\n") });
      continue;
    }

    const heading = line.match(/^(#{2,3})\s+(.*)$/);
    if (heading) {
      endParagraph();
      endList();
      blocks.push({ kind: heading[1].length === 2 ? "h2" : "h3", text: heading[2].trim() });
      continue;
    }

    const item = line.match(/^[-*]\s+(.*)$/);
    if (item) {
      endParagraph();
      (list ??= []).push(item[1].trim());
      continue;
    }

    if (!line.trim()) {
      endParagraph();
      endList();
      continue;
    }

    // An indented line continues the current list item.
    if (list && /^\s+\S/.test(line)) {
      list[list.length - 1] += ` ${line.trim()}`;
      continue;
    }

    endList();
    paragraph.push(line.trim());
  }

  endParagraph();
  endList();
  return blocks;
}

const INLINE = /(`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;

function inline(text: string): ReactNode[] {
  return text
    .split(INLINE)
    .filter(Boolean)
    .map((part, i) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={i}>{part.slice(1, -1)}</code>;
      }
      const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      if (link) {
        const external = /^https?:\/\//.test(link[2]);
        return (
          <a key={i} href={link[2]} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
            {link[1]}
          </a>
        );
      }
      return part;
    });
}

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function Markdown({ source }: { source: string }) {
  return (
    <div className="post">
      {parse(source).map((block, i) => {
        switch (block.kind) {
          case "h2":
            return (
              <h2 key={i} id={slug(block.text)}>
                {inline(block.text)}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} id={slug(block.text)}>
                {inline(block.text)}
              </h3>
            );
          case "ul":
            return (
              <ul key={i}>
                {block.items.map((entry, j) => (
                  <li key={j}>{inline(entry)}</li>
                ))}
              </ul>
            );
          case "code":
            return (
              <pre key={i} data-lang={block.lang || undefined}>
                <code>{block.text}</code>
              </pre>
            );
          default:
            return <p key={i}>{inline(block.text)}</p>;
        }
      })}
    </div>
  );
}
