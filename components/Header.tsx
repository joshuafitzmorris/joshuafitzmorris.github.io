"use client";

import { useEffect, useState } from "react";
import { person, sections } from "@/content/site";
import { ThemeToggle } from "./ThemeToggle";
import { Shell } from "./primitives";

export function Header() {
  const [lifted, setLifted] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (!nodes.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`no-print fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        lifted
          ? // Opaque enough to stay legible on its own: where backdrop-filter
            // is unsupported or not composited, 88% still separates the bar
            // from the prose scrolling under it.
            "border-b border-hairline bg-field/88 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent"
      }`}
    >
      <Shell className="flex h-16 items-center justify-between gap-6">
        <a
          href="#top"
          className="font-display text-[0.98rem] font-semibold tracking-tight"
        >
          {person.name}
        </a>

        <nav aria-label="Sections" className="hidden items-center gap-7 md:flex">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-current={active === section.id ? "true" : undefined}
              className={`text-[0.82rem] transition-colors ${
                active === section.id
                  ? "text-ink"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {section.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <a
            href={person.resume}
            className="mr-2 text-[0.82rem] text-ink-muted transition-colors hover:text-ink"
          >
            Résumé
          </a>
          <ThemeToggle />
        </div>
      </Shell>
    </header>
  );
}
