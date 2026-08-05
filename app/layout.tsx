import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import { person } from "@/content/site";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const description =
  "Lead Software Engineer building production AI platforms, agents, and document intelligence. Sole code owner of a seven-service GCP platform delivered from inception to production in 28 weeks.";

/**
 * Declared explicitly rather than left to the file convention. The convention
 * emits an extensionless `/opengraph-image`, which a plain static host serves
 * as octet-stream, and LinkedIn's crawler drops it. `pnpm build` copies the
 * generated PNG to this path (see the `postbuild` script).
 */
const ogImage = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: `${person.name} — ${person.role}`,
};

export const metadata: Metadata = {
  metadataBase: new URL(person.siteUrl),
  title: {
    default: `${person.name} — ${person.role}`,
    template: `%s — ${person.name}`,
  },
  description,
  keywords: [
    "Lead Software Engineer",
    "Senior Software Engineer",
    "AI Engineer",
    "Forward Deployed Engineer",
    "Production AI",
    "RAG",
    "MCP",
    "Document intelligence",
    "Python",
    "FastAPI",
    "TypeScript",
    "React",
    "GCP",
    "Vancouver",
  ],
  authors: [{ name: person.name, url: person.siteUrl }],
  creator: person.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    title: `${person.name} — ${person.role}`,
    description,
    url: person.siteUrl,
    siteName: person.name,
    locale: "en_CA",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${person.name} — ${person.role}`,
    description,
    images: [ogImage],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfb" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1210" },
  ],
};

/**
 * Painted before first paint so the field never flashes white at someone who
 * asked for dark.
 */
const paintTheme = `(function(){var r=document.documentElement;try{var s=localStorage.getItem("theme");var d=window.matchMedia("(prefers-color-scheme: dark)").matches;r.setAttribute("data-theme",s==="dark"||s==="light"?s:(d?"dark":"light"));}catch(e){r.setAttribute("data-theme","light");}
// Arm the reveal only when we can actually run it. No script, no observer, or
// a request for less motion, and every block just starts visible.
try{if("IntersectionObserver" in window&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){r.setAttribute("data-anim","on");}}catch(e){}})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  jobTitle: person.role,
  description,
  url: person.siteUrl,
  email: `mailto:${person.email}`,
  sameAs: [person.linkedin],
  address: { "@type": "PostalAddress", addressLocality: "Vancouver", addressRegion: "BC", addressCountry: "CA" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Simon Fraser University" },
  knowsAbout: [
    "Production AI systems",
    "Retrieval augmented generation",
    "Model Context Protocol",
    "Document intelligence",
    "Cloud architecture",
    "Full-stack engineering",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${newsreader.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: paintTheme }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
