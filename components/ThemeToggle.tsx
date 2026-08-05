"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * A corner glyph, not a control panel. The initial theme is already painted by
 * the inline script in the document head, so this only ever reads what is
 * there and flips it.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");
  }, []);

  const flip = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private mode. The choice simply does not persist.
    }
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={flip}
      aria-label={
        theme === "dark" ? "Switch to light appearance" : "Switch to dark appearance"
      }
      className="grid h-9 w-9 place-items-center rounded-full text-ink-muted transition-colors hover:text-ink"
    >
      <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]">
        {/* One glyph that reads in both states: a disc, half filled. */}
        <circle cx="10" cy="10" r="6.25" stroke="currentColor" strokeWidth="1.4" />
        <path d="M10 3.75a6.25 6.25 0 0 1 0 12.5V3.75Z" fill="currentColor" />
      </svg>
    </button>
  );
}
