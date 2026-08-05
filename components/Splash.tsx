/**
 * The splash: one precious color moment per band.
 *
 * Blurred watercolor lobes bleeding in from off-canvas, anchored to the star
 * of the band (the thing it is about), breathing slowly. The line that keeps
 * it honest: anchored to a hero, one per band, never wallpaper. It is dimmed
 * to a glow in dark mode and held still under Reduce Motion.
 */

type Palette = "warm" | "calm" | "dawn" | "dusk";
type Anchor = "left" | "right" | "center";

const PIGMENTS: Record<Palette, string[]> = {
  // Something needs saving, or a reward is on screen.
  warm: ["--coral", "--butter", "--lilac"],
  // The shelf is at peace.
  calm: ["--herb", "--butter"],
  dawn: ["--butter", "--coral"],
  dusk: ["--lilac", "--coral"],
};

/**
 * Deliberately small. A lobe reads as a bloom beside the hero, not as a
 * background gradient: the widest is under a third of a desktop viewport, and
 * each one is pulled far enough past the edge to be cropped by the band.
 */
const LOBES = [
  { top: "-16%", size: "clamp(230px, 27vw, 430px)", offset: "-9%", weight: 1, drift: "0ms" },
  { top: "30%", size: "clamp(170px, 20vw, 330px)", offset: "5%", weight: 0.7, drift: "-2200ms" },
  { top: "62%", size: "clamp(140px, 16vw, 260px)", offset: "-15%", weight: 0.5, drift: "-4100ms" },
];

export function Splash({
  palette = "calm",
  anchor = "right",
  className = "",
  intensity = 1,
}: {
  palette?: Palette;
  anchor?: Anchor;
  className?: string;
  intensity?: number;
}) {
  const pigments = PIGMENTS[palette];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-clip ${className}`}
    >
      {pigments.map((pigment, i) => {
        const lobe = LOBES[i] ?? LOBES[LOBES.length - 1];
        const alpha = `calc(var(--splash-alpha) * ${(lobe.weight * intensity).toFixed(3)})`;

        // Lobes bleed in from an edge rather than floating free in the middle.
        const lateral =
          anchor === "center"
            ? { left: `calc(28% + ${i * 15}%)` }
            : anchor === "left"
              ? { left: lobe.offset }
              : { right: lobe.offset };

        return (
          <div
            key={pigment}
            className="splash-lobe absolute aspect-square rounded-full"
            style={{
              ...lateral,
              top: lobe.top,
              width: lobe.size,
              animationDelay: lobe.drift,
              animationDuration: `${6500 + i * 900}ms`,
              filter: "blur(var(--splash-blur))",
              background: `radial-gradient(circle at 44% 42%, rgb(var(${pigment}) / ${alpha}) 0%, rgb(var(${pigment}) / calc(${alpha} * 0.32)) 46%, transparent 72%)`,
            }}
          />
        );
      })}
    </div>
  );
}
