#!/usr/bin/env bash
#
# Build and publish to the gh-pages branch that GitHub Pages serves.
#
# Source lives on main; only the built output goes to gh-pages. A GitHub
# Actions workflow would be tidier, but the local gh token has no `workflow`
# scope, so the push happens from here.
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree is dirty. Commit or stash before deploying." >&2
  exit 1
fi

SHA="$(git rev-parse --short HEAD)"
WORKTREE=".deploy"

pnpm build

# Guard against publishing an empty or half-written build.
test -s out/index.html || { echo "out/index.html missing or empty" >&2; exit 1; }
test -s out/opengraph-image.png || { echo "out/opengraph-image.png missing" >&2; exit 1; }

cleanup() { git worktree remove "$WORKTREE" --force >/dev/null 2>&1 || true; }
trap cleanup EXIT

git worktree remove "$WORKTREE" --force >/dev/null 2>&1 || true
git fetch -q origin gh-pages 2>/dev/null || true
git worktree add -B gh-pages "$WORKTREE" origin/gh-pages >/dev/null 2>&1 \
  || git worktree add -B gh-pages "$WORKTREE" >/dev/null

# Wipe everything except git's own bookkeeping, so deletions propagate.
find "$WORKTREE" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
cp -R out/. "$WORKTREE"/

cd "$WORKTREE"
git add -A
if git diff --cached --quiet; then
  echo "No change in the built output. Nothing to deploy."
else
  git commit -q -m "Deploy ${SHA}"
  git push -q -f origin gh-pages
  echo "Pushed gh-pages (${SHA})."
fi
cd ..

# Pages does not always rebuild on push when the source branch was switched
# by hand, so ask for a build explicitly and report the result.
gh api -X POST repos/joshuafitzmorris/joshuafitzmorris.github.io/pages/builds \
  --jq '"Pages build " + .status' 2>/dev/null || echo "Could not trigger a Pages build; check gh auth."

echo "https://joshuafitzmorris.github.io/"
