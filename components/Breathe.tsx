"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Screens inhale on arrival: a staggered fade and rise as each block enters
 * the viewport. Reduce Motion is handled in CSS, so this stays a one-way
 * state flip and never animates a user who asked it not to.
 */
export function Breathe({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  /** Milliseconds of stagger inside a group. */
  delay?: number;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [inhaled, setInhaled] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setInhaled(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInhaled(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.06 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-inhaled={inhaled}
      className={`breathe ${className}`}
      style={{ "--breathe-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
