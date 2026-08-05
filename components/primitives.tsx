import type { ReactNode } from "react";
import type { DisplayPart } from "@/content/site";

/** Structure labels are small-caps eyebrows, never headings in disguise. */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

/**
 * The italic gesture: authored copy may italicize its key word. Generated or
 * borrowed copy stays roman, which is why the parts carry an explicit flag
 * rather than being parsed out of a marked-up string.
 */
export function Display({
  parts,
  className = "",
  as: Tag = "h2",
}: {
  parts: readonly DisplayPart[];
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  return (
    <Tag className={`display ${className}`}>
      {parts.map((part, i) =>
        part.em ? <em key={i}>{part.text}</em> : <span key={i}>{part.text}</span>,
      )}
    </Tag>
  );
}

/** A full-bleed hairline. The default separator, in place of a border box. */
export function Hairline({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`h-px w-full bg-hairline ${className}`} />;
}

export function Shell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-shell px-gutter ${className}`}>{children}</div>
  );
}

export function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={`h-3 w-3 ${className}`}
    >
      <path
        d="M3 9L9 3M9 3H4.2M9 3v4.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
