import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { hero, metrics, person } from "@/content/site";

export const alt = `${person.name} — ${person.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Rendered once at build time, so the static export ships a real PNG.
export const dynamic = "force-static";

/**
 * The link preview. This is the first thing a recruiter sees when the URL is
 * pasted into LinkedIn, so it carries the same field, ink, and splash as the
 * page rather than a generic card.
 */
export default async function OpengraphImage() {
  // Static instances of the variable family: Satori cannot parse a variable
  // TTF, so these are pinned to wght 600 / 500 at an optical size of 36.
  const [roman, italic] = await Promise.all([
    readFile(join(process.cwd(), "assets", "Newsreader-SemiBold.ttf")),
    readFile(join(process.cwd(), "assets", "Newsreader-MediumItalic.ttf")),
  ]);

  const FIELD = "#fcfcfb";
  const INK = "#17110d";
  const MUTED = "#7b7167";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: FIELD,
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* The splash, bleeding in from off-canvas and anchored to the right. */}
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -160,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background:
              "radial-gradient(circle at 44% 42%, rgba(233,117,91,0.34) 0%, rgba(233,117,91,0.11) 46%, rgba(233,117,91,0) 72%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 190,
            right: 40,
            width: 430,
            height: 430,
            borderRadius: 9999,
            background:
              "radial-gradient(circle at 44% 42%, rgba(242,200,106,0.30) 0%, rgba(242,200,106,0.10) 46%, rgba(242,200,106,0) 72%)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 20,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: MUTED,
              fontWeight: 600,
            }}
          >
            {person.name}
          </div>
          <div
            style={{
              marginTop: 34,
              display: "flex",
              flexWrap: "wrap",
              fontFamily: "Newsreader",
              fontSize: 82,
              lineHeight: 1.06,
              letterSpacing: -1.6,
              color: INK,
              maxWidth: 900,
            }}
          >
            {hero.display.map((part, i) => (
              <span
                key={i}
                style={{
                  fontStyle: part.em ? "italic" : "normal",
                  // Each part is a flex child here, and flex would otherwise
                  // strip the leading space that joins it to the last one.
                  whiteSpace: "pre",
                }}
              >
                {part.text}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", width: "100%", height: 1, background: "rgba(23,17,13,0.13)" }} />
          <div style={{ display: "flex", marginTop: 28, gap: 56 }}>
            {metrics.slice(0, 4).map((metric) => (
              <div key={metric.label} style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 6,
                    fontFamily: "Newsreader",
                    fontSize: 40,
                    color: INK,
                  }}
                >
                  {metric.value}
                  <span style={{ fontSize: 20, color: MUTED }}>{metric.unit}</span>
                </div>
                <div style={{ marginTop: 8, fontSize: 17, color: MUTED, maxWidth: 200 }}>
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      // Both faces register at 400 so style, not weight, selects between
      // them. The real weights are already baked into the instances, and
      // declaring 600/500 made unweighted text resolve to the nearer face,
      // which set the whole card in italic.
      fonts: [
        { name: "Newsreader", data: roman, style: "normal", weight: 400 },
        { name: "Newsreader", data: italic, style: "italic", weight: 400 },
      ],
    },
  );
}
