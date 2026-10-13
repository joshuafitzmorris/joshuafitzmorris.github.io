import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/Markdown";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowUpRight, Eyebrow, Hairline, Shell } from "@/components/primitives";
import { person, writing } from "@/content/site";

// Static export: every post is known at build time, and nothing else exists.
export const dynamicParams = false;

export function generateStaticParams() {
  return writing.map((post) => ({ slug: post.slug }));
}

type Props = { params: Promise<{ slug: string }> };

const ogImage = { url: "/opengraph-image.png", width: 1200, height: 630 };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = writing.find((p) => p.slug === slug);
  if (!post) return {};
  const url = `${person.siteUrl}/writing/${post.slug}/`;
  return {
    title: post.title,
    description: post.dek,
    alternates: { canonical: `/writing/${post.slug}/` },
    // A child openGraph block replaces the layout's whole object, so the card
    // image is restated here.
    openGraph: {
      type: "article",
      title: post.title,
      description: post.dek,
      url,
      siteName: person.name,
      publishedTime: post.date,
      authors: [person.name],
      images: [{ ...ogImage, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.dek,
      images: [{ ...ogImage, alt: post.title }],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = writing.find((p) => p.slug === slug);
  if (!post) notFound();

  const source = await readFile(
    path.join(process.cwd(), "content", "posts", `${post.slug}.md`),
    "utf8",
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.title,
    description: post.dek,
    datePublished: post.date,
    author: { "@type": "Person", name: person.name, url: person.siteUrl },
    url: `${person.siteUrl}/writing/${post.slug}/`,
    isBasedOn: post.repo,
  };

  return (
    <>
      <header className="no-print border-b border-hairline">
        <Shell className="flex h-16 items-center justify-between gap-6">
          <a href="/" className="font-display text-[0.98rem] font-semibold tracking-tight">
            {person.name}
          </a>
          <div className="flex items-center gap-1">
            <a
              href="/#writing"
              className="mr-2 text-[0.82rem] text-ink-muted transition-colors hover:text-ink"
            >
              Writing
            </a>
            <ThemeToggle />
          </div>
        </Shell>
      </header>

      <main>
        <article className="pt-20 pb-24 sm:pt-28 sm:pb-32">
          <Shell>
            <div className="mx-auto max-w-[68ch]">
              <Eyebrow>
                Writing · <time dateTime={post.date}>{post.dateLabel}</time>
              </Eyebrow>
              <h1 className="display mt-6 text-[clamp(2.1rem,5vw,3.4rem)]">{post.title}</h1>
              <p className="mt-6 font-display text-[clamp(1.12rem,1.9vw,1.35rem)] leading-[1.5] text-ink-soft">
                {post.dek}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <a href={post.repo} target="_blank" rel="noreferrer" className="underline-action">
                  The code on GitHub
                  <ArrowUpRight />
                </a>
              </div>

              <Hairline className="mt-12" />
              <Markdown source={source} />
              <Hairline className="mt-16" />

              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <a href="/" className="underline-action">
                  {person.name}
                </a>
                <a href={post.repo} target="_blank" rel="noreferrer" className="underline-action">
                  {post.repo.split("/").pop()}
                  <ArrowUpRight />
                </a>
                <a href={`mailto:${person.email}`} className="underline-action">
                  {person.email}
                </a>
              </div>
            </div>
          </Shell>
        </article>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
