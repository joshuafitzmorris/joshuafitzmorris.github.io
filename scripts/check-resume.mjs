/**
 * Fails the build if the served résumé has drifted from the master.
 *
 * The master is regenerated in the assistant workspace (build_resume.py) and
 * public/ holds a copy, so the two silently diverge the moment the master is
 * rebuilt. That already happened once: the site shipped a copy taken four
 * minutes before the master was regenerated under a different project name.
 *
 * Set RESUME_MASTER to override the path, or SKIP_RESUME_CHECK=1 to bypass
 * (for example on a machine that does not have the assistant workspace).
 */
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const MASTER =
  process.env.RESUME_MASTER ??
  new URL(
    "../../linkedin-recruiter-assistant/resume/Joshua_FitzMorris_Resume.pdf",
    import.meta.url,
  ).pathname;

const SERVED = new URL("../public/Joshua_FitzMorris_Resume.pdf", import.meta.url).pathname;

if (process.env.SKIP_RESUME_CHECK === "1") {
  console.log("check-resume: skipped");
  process.exit(0);
}

const digest = async (p) => createHash("sha256").update(await readFile(p)).digest("hex");

let master;
try {
  master = await digest(MASTER);
} catch {
  console.warn(
    `check-resume: master not readable at ${MASTER}, skipping. ` +
      "Set RESUME_MASTER or SKIP_RESUME_CHECK=1 to silence this.",
  );
  process.exit(0);
}

const served = await digest(SERVED);

if (master !== served) {
  console.error(
    [
      "",
      "check-resume: public/Joshua_FitzMorris_Resume.pdf differs from the master.",
      `  master: ${MASTER}`,
      `  served: ${SERVED}`,
      "",
      "Copy the current one, then check content/site.ts still matches it:",
      `  cp "${MASTER}" public/`,
      "",
    ].join("\n"),
  );
  process.exit(1);
}

console.log("check-resume: résumé matches the master");
