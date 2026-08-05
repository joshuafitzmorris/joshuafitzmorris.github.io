import { Breathe } from "@/components/Breathe";
import { Header } from "@/components/Header";
import { Splash } from "@/components/Splash";
import { ArrowUpRight, Display, Eyebrow, Hairline, Shell } from "@/components/primitives";
import {
  alsoBuilt,
  building,
  contact,
  credentials,
  hero,
  metrics,
  person,
  principles,
  stack,
  work,
} from "@/content/site";

export default function Home() {
  return (
    <>
      <Header />

      <main id="top">
        <Hero />
        <Metrics />
        <Work />
        <Building />
        <Approach />
        <Stack />
        <Contact />
      </main>

      <Colophon />
    </>
  );
}

/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative isolate overflow-clip pt-28 pb-20 sm:pt-36 sm:pb-28">
      <Splash palette="warm" anchor="right" />

      <Shell>
        <Breathe>
          <Eyebrow>{hero.eyebrow}</Eyebrow>
        </Breathe>

        <Breathe delay={90}>
          <Display
            as="h1"
            parts={hero.display}
            className="mt-7 max-w-[16ch] text-[clamp(2.5rem,6.4vw,5.25rem)]"
          />
        </Breathe>

        <Breathe delay={200}>
          <p className="prose-body mt-8">{hero.lede}</p>
        </Breathe>

        <Breathe delay={300}>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <a href="#contact" className="ink-pill">
              Get in touch
            </a>
            <a href={person.resume} className="underline-action">
              Résumé (PDF)
              <ArrowUpRight />
            </a>
            <a
              href={person.linkedin}
              target="_blank"
              rel="noreferrer"
              className="underline-action"
            >
              LinkedIn
              <ArrowUpRight />
            </a>
          </div>
        </Breathe>

        <Breathe delay={400}>
          <p className="mt-12 text-sm text-ink-muted">
            {person.location} · {person.availability}
          </p>
        </Breathe>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Metrics() {
  return (
    <section aria-label="Selected results">
      <Hairline />
      <Shell>
        <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {metrics.map((metric, i) => (
            <Breathe
              key={metric.label}
              delay={i * 70}
              className="flex flex-col border-hairline py-8 not-last:border-b sm:py-10 lg:border-b-0 lg:not-last:border-r lg:pr-6 lg:not-first:pl-8"
            >
              {/*
                The term precedes its description in the DOM, as the spec
                requires, and `order` puts the number on top visually. Reading
                the label out of a visually-hidden twin would say it twice.
              */}
              <dt className="order-2 mt-3 max-w-[22ch] text-[0.82rem] leading-snug text-ink-muted">
                {metric.label}
              </dt>
              <dd className="order-1">
                <span className="numeral font-display text-[clamp(2.1rem,4.4vw,2.9rem)] leading-none font-semibold">
                  {metric.value}
                </span>
                <span className="ml-1.5 font-display text-lg text-ink-muted">
                  {metric.unit}
                </span>
              </dd>
            </Breathe>
          ))}
        </dl>
      </Shell>
      <Hairline />
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function SectionHead({
  id,
  eyebrow,
  title,
  lede,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <Breathe className="pt-28 pb-14 sm:pt-36 sm:pb-20">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className="display mt-6 max-w-[18ch] scroll-mt-24 text-[clamp(2.1rem,5vw,3.6rem)]"
      >
        {title}
      </h2>
      {lede ? <p className="prose-body mt-6">{lede}</p> : null}
    </Breathe>
  );
}

function StackLine({ items }: { items: readonly string[] }) {
  return (
    <div className="mt-8 border-t border-hairline pt-5">
      <Eyebrow className="mb-3">Stack</Eyebrow>
      <p className="text-[0.84rem] leading-relaxed text-ink-muted">
        {items.join("  ·  ")}
      </p>
    </div>
  );
}

function Work() {
  return (
    <section id="work" className="scroll-mt-16">
      <Shell>
        <SectionHead
          eyebrow="Selected work"
          title="Client platforms, taken to production."
          lede="Five years at Ollon, a Vancouver software consultancy, as the engineer clients get handed when the thing has to actually ship."
        />
      </Shell>

      {work.map((project, index) => (
        <article key={project.slug} className="relative isolate overflow-clip">
          <Hairline />
          {/* One splash for the section, anchored to its star. */}
          {index === 0 ? <Splash palette={project.palette} anchor="left" intensity={0.85} /> : null}

          <Shell className="grid gap-y-10 py-16 sm:py-24 lg:grid-cols-12 lg:gap-x-16">
            <Breathe className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <span className="numeral eyebrow block">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="display mt-5 text-[clamp(1.7rem,3.2vw,2.35rem)]">
                  {project.name}
                </h3>
                <p className="mt-3 text-[0.95rem] text-ink-soft">{project.kind}</p>
                <p className="numeral mt-5 text-[0.82rem] text-ink-muted">
                  {project.org} · {project.period}
                </p>
              </div>
            </Breathe>

            <Breathe delay={110} className="lg:col-span-8">
              <p className="font-display text-[clamp(1.15rem,2vw,1.45rem)] leading-[1.45] text-ink">
                {project.summary}
              </p>

              <div className="mt-7 space-y-5">
                {project.body.map((paragraph, i) => (
                  <p key={i} className="prose-body max-w-[68ch]">
                    {paragraph}
                  </p>
                ))}
              </div>

              <dl className="mt-10 grid grid-cols-2 gap-y-7 border-t border-hairline pt-7 sm:grid-cols-4">
                {project.outcomes.map((outcome) => (
                  <div key={outcome.label} className="flex flex-col pr-4">
                    <dt className="order-2 mt-2.5 max-w-[18ch] text-[0.78rem] leading-snug text-ink-muted">
                      {outcome.label}
                    </dt>
                    <dd className="numeral order-1 font-display text-[1.5rem] leading-none font-semibold">
                      {outcome.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <StackLine items={project.stack} />
            </Breathe>
          </Shell>
        </article>
      ))}

      <Hairline />
      <Shell className="grid gap-y-8 py-16 sm:py-20 lg:grid-cols-12 lg:gap-x-16">
        <Breathe className="lg:col-span-4">
          <Eyebrow>Also built</Eyebrow>
        </Breathe>
        <div className="lg:col-span-8">
          {alsoBuilt.map((entry, i) => (
            <Breathe
              key={entry.client}
              delay={i * 70}
              className="flex flex-col gap-1.5 border-b border-hairline py-5 first:border-t sm:flex-row sm:items-baseline sm:gap-8"
            >
              <span className="w-44 shrink-0 font-display text-[1.05rem] font-semibold">
                {entry.client}
              </span>
              <span className="text-[0.92rem] leading-relaxed text-ink-muted">
                {entry.detail}
              </span>
            </Breathe>
          ))}
        </div>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Building() {
  return (
    <section id="building" className="scroll-mt-16">
      <Hairline />
      <Shell>
        <SectionHead
          eyebrow="Building now"
          title="Two products I am building on my own time."
          lede="Both start from the same observation: multimodal models just changed what is possible, and most of the interesting work is in the unglamorous half, the evaluation, the confidence handling, and the moment a human has to be asked."
        />
      </Shell>

      {building.map((project, index) => (
        <article key={project.name} className="relative isolate overflow-clip">
          <Hairline />
          <Splash
            palette={project.palette}
            anchor={index % 2 === 0 ? "right" : "left"}
            intensity={0.8}
          />

          <Shell className="grid gap-y-10 py-16 sm:py-24 lg:grid-cols-12 lg:gap-x-16">
            <Breathe className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <h3 className="display text-[clamp(1.7rem,3.2vw,2.35rem)]">
                  {project.name}
                </h3>
                <p className="mt-4 font-display text-[1.05rem] italic text-ink-soft">
                  {project.tagline}
                </p>
                <p className="eyebrow mt-6">{project.status}</p>
              </div>
            </Breathe>

            <Breathe delay={110} className="lg:col-span-8">
              <div className="space-y-5">
                {project.body.map((paragraph, i) => (
                  <p key={i} className="prose-body max-w-[68ch]">
                    {paragraph}
                  </p>
                ))}
              </div>

              <figure className="mt-10 border-l border-hairline-strong pl-6">
                <blockquote className="font-display text-[clamp(1.1rem,1.9vw,1.35rem)] leading-[1.5]">
                  {project.quote}
                </blockquote>
                <figcaption className="eyebrow mt-4">{project.quoteSource}</figcaption>
              </figure>

              <StackLine items={project.stack} />
            </Breathe>
          </Shell>
        </article>
      ))}
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Approach() {
  return (
    <section id="approach" className="scroll-mt-16">
      <Hairline />
      <Shell>
        <SectionHead
          eyebrow="Approach"
          title="How I keep AI systems honest."
          lede="Shipping a model into production is mostly a question of what you refuse to claim without proof. These are the lines I hold, taken from the constitutions I write for my own projects."
        />

        <div className="grid gap-x-16 gap-y-0 pb-24 sm:pb-32 lg:grid-cols-2">
          {principles.map((principle, i) => (
            <Breathe
              key={principle.title}
              delay={(i % 2) * 90}
              className="border-t border-hairline py-9"
            >
              <span className="numeral eyebrow">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="display mt-4 text-[1.4rem]">{principle.title}</h3>
              <p className="prose-body mt-4 max-w-[52ch] text-[0.98rem]">
                {principle.body}
              </p>
            </Breathe>
          ))}
        </div>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Stack() {
  return (
    <section id="stack" className="scroll-mt-16">
      <Hairline />
      <Shell>
        <SectionHead eyebrow="Toolkit" title="What I reach for." />

        <div className="pb-8">
          {stack.map((group, i) => (
            <Breathe
              key={group.group}
              delay={i * 60}
              className="grid gap-y-3 border-t border-hairline py-6 sm:grid-cols-12 sm:gap-x-10"
            >
              <h3 className="eyebrow pt-1.5 sm:col-span-3">{group.group}</h3>
              <p className="text-[0.95rem] leading-relaxed text-ink-soft sm:col-span-9">
                {group.items.join("  ·  ")}
              </p>
            </Breathe>
          ))}
        </div>

        <div className="pb-24 sm:pb-32">
          {credentials.map((credential, i) => (
            <Breathe
              key={credential.title}
              delay={i * 60}
              className="flex flex-col gap-1 border-t border-hairline py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
            >
              <span className="font-display text-[1.05rem] font-semibold">
                {credential.title}
              </span>
              <span className="numeral text-[0.88rem] text-ink-muted">
                {credential.org} · {credential.period}
              </span>
            </Breathe>
          ))}
        </div>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Contact() {
  return (
    <section id="contact" className="relative isolate scroll-mt-16 overflow-clip">
      <Hairline />
      <Splash palette="dusk" anchor="center" intensity={0.9} />

      <Shell className="py-28 sm:py-40">
        <Breathe>
          <Eyebrow>Contact</Eyebrow>
        </Breathe>

        <Breathe delay={90}>
          <Display
            parts={contact.display}
            className="mt-7 max-w-[15ch] text-[clamp(2.4rem,6.4vw,4.6rem)]"
          />
        </Breathe>

        <Breathe delay={190}>
          <p className="prose-body mt-8">{contact.lede}</p>
        </Breathe>

        <Breathe delay={280}>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5">
            <a href={`mailto:${person.email}`} className="ink-pill">
              {person.email}
            </a>
            <a
              href={person.linkedin}
              target="_blank"
              rel="noreferrer"
              className="underline-action"
            >
              {person.linkedinLabel}
              <ArrowUpRight />
            </a>
            <a href={person.resume} className="underline-action">
              Download résumé
              <ArrowUpRight />
            </a>
          </div>
        </Breathe>
      </Shell>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Colophon() {
  return (
    <footer className="border-t border-hairline">
      <Shell className="flex flex-col gap-4 py-9 sm:flex-row sm:items-center sm:justify-between">
        <p className="numeral text-[0.8rem] text-ink-muted">
          © {new Date().getFullYear()} {person.name}. {person.location}.
        </p>
        <p className="text-[0.8rem] text-ink-muted">
          Next.js, TypeScript, Tailwind. Set in Newsreader and Inter.
        </p>
      </Shell>
    </footer>
  );
}
