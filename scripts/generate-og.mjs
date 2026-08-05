/**
 * Generates public/opengraph-image.png, the 1200x630 link preview card.
 *
 * This deliberately does NOT use Next's app/opengraph-image convention. That
 * convention emits an extensionless `/opengraph-image`, which a plain static
 * host (GitHub Pages, S3) serves as application/octet-stream and the LinkedIn
 * crawler drops. It also wins over any explicit `openGraph.images` in
 * metadata, so it cannot simply be pointed elsewhere. Generating a real .png
 * into public/ sidesteps both problems.
 *
 * Runs automatically before `pnpm build` via the `prebuild` script.
 */
import { readFile, writeFile } from "node:fs/promises";
import { createElement as h } from "react";
import { ImageResponse } from "next/og.js";

const FIELD = "#fcfcfb";
const INK = "#17110d";
const MUTED = "#7b7167";

// content/site.ts is TypeScript, and this script has to run under plain node
// during prebuild, so the few values the card needs are read out of it rather
// than imported. Kept in one place so a drift shows up as a thrown error.
const site = await readFile(new URL("../content/site.ts", import.meta.url), "utf8");

function must(pattern, label) {
  const match = site.match(pattern);
  if (!match) throw new Error(`generate-og: could not read ${label} from content/site.ts`);
  return match;
}

const name = must(/name:\s*"([^"]+)"/, "person.name")[1];

const displayBlock = must(
  /const heroDisplay: DisplayPart\[\] = \[([\s\S]*?)\];/,
  "hero.display",
)[1];
const display = [...displayBlock.matchAll(/\{\s*text:\s*"([^"]*)"(,\s*em:\s*true)?\s*\}/g)].map(
  (m) => ({ text: m[1], em: Boolean(m[2]) }),
);
if (!display.length) throw new Error("generate-og: hero.display parsed empty");

const metricsBlock = must(/export const metrics = \[([\s\S]*?)\] as const;/, "metrics")[1];
const metrics = [...metricsBlock.matchAll(
  /\{\s*value:\s*"([^"]*)",\s*unit:\s*"([^"]*)",\s*label:\s*"([^"]*)"\s*\}/g,
)].map((m) => ({ value: m[1], unit: m[2], label: m[3] }));
if (metrics.length < 4) throw new Error("generate-og: expected at least 4 metrics");

const lobe = (style, rgb, alpha) =>
  h("div", {
    style: {
      position: "absolute",
      borderRadius: 9999,
      background: `radial-gradient(circle at 44% 42%, rgba(${rgb},${alpha}) 0%, rgba(${rgb},${
        alpha * 0.32
      }) 46%, rgba(${rgb},0) 72%)`,
      ...style,
    },
  });

const card = h(
  "div",
  {
    style: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      background: FIELD,
      padding: "72px 80px",
      position: "relative",
      fontFamily: "Newsreader",
    },
  },
  // One splash, bleeding in from off-canvas and anchored to the right.
  lobe({ top: -140, right: -160, width: 620, height: 620 }, "233,117,91", 0.34),
  lobe({ top: 190, right: 40, width: 430, height: 430 }, "242,200,106", 0.3),

  h(
    "div",
    { style: { display: "flex", flexDirection: "column" } },
    h(
      "div",
      {
        style: {
          fontSize: 20,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: MUTED,
        },
      },
      name,
    ),
    h(
      "div",
      {
        style: {
          marginTop: 34,
          display: "flex",
          flexWrap: "wrap",
          fontSize: 82,
          lineHeight: 1.06,
          letterSpacing: -1.6,
          color: INK,
          maxWidth: 900,
        },
      },
      ...display.map((part, i) =>
        h(
          "span",
          {
            key: i,
            style: {
              fontStyle: part.em ? "italic" : "normal",
              // Flex would otherwise strip the space joining these parts.
              whiteSpace: "pre",
            },
          },
          part.text,
        ),
      ),
    ),
  ),

  h(
    "div",
    { style: { display: "flex", flexDirection: "column" } },
    h("div", {
      style: { display: "flex", width: "100%", height: 1, background: "rgba(23,17,13,0.13)" },
    }),
    h(
      "div",
      { style: { display: "flex", marginTop: 28, gap: 52 } },
      ...metrics.slice(0, 4).map((metric, i) =>
        h(
          "div",
          { key: i, style: { display: "flex", flexDirection: "column", width: 218 } },
          h(
            "div",
            {
              style: { display: "flex", alignItems: "baseline", gap: 6, fontSize: 40, color: INK },
            },
            metric.value,
            h("span", { style: { fontSize: 20, color: MUTED } }, metric.unit),
          ),
          h("div", { style: { marginTop: 8, fontSize: 17, color: MUTED } }, metric.label),
        ),
      ),
    ),
  ),
);

// Satori cannot parse variable fonts, so assets/ holds two static instances
// pinned out of the Newsreader variable family.
const [roman, italic] = await Promise.all([
  readFile(new URL("../assets/Newsreader-SemiBold.ttf", import.meta.url)),
  readFile(new URL("../assets/Newsreader-MediumItalic.ttf", import.meta.url)),
]);

const response = new ImageResponse(card, {
  width: 1200,
  height: 630,
  // Both register at 400 so style, not weight, selects between them. The real
  // weights are baked into the instances; declaring 600/500 made unweighted
  // text resolve to the nearer face and set the whole card in italic.
  fonts: [
    { name: "Newsreader", data: roman, style: "normal", weight: 400 },
    { name: "Newsreader", data: italic, style: "italic", weight: 400 },
  ],
});

const png = Buffer.from(await response.arrayBuffer());

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!png.subarray(0, 8).equals(PNG_MAGIC)) {
  throw new Error("generate-og: output is not a PNG");
}

const out = new URL("../public/opengraph-image.png", import.meta.url);
await writeFile(out, png);
console.log(`generate-og: wrote public/opengraph-image.png (${(png.length / 1024).toFixed(0)} kB)`);
