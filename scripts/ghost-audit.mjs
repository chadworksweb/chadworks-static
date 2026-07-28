// Ghost audit -- finds routes that are LIVE ON THE SERVER but no longer in the
// build. It is the one drift class the other four deploy gates structurally
// cannot see: index-audit, price-audit, stack-query-audit and portfolio-audit
// all read `out/`, and a ghost is by definition not in `out/`.
//
// WHY GHOSTS EXIST. deploy.sh ships with `tar czf - | ssh "sudo tar xzf -"`,
// which extracts over the docroot and never deletes. That is deliberate and
// mostly harmless -- Next hashes its build assets, so stale /_next/static/*
// just accumulate. What is NOT harmless: delete a page from the codebase, or
// rename its route, and the old directory keeps serving its last build forever.
// It is gone from the sitemap (generated) and gone from launch.ts, so nothing
// looks at it again.
//
// The danger is not disk (prod 49 MB against 98 GB free, measured 2026-07-28).
// The danger is that a ghost serves whatever robots directive was baked in the
// day it last deployed. Delete a page that was LAUNCHED and its ghost keeps
// answering 200 with `index` -- a real crawlable page, absent from the sitemap,
// contradicting nothing that would flag it. Audited 2026-07-28: three were live
// on prod (/ai-viz/, /build-your-website-package/, /my-industry-specialties/),
// all noindex by luck rather than design, plus /showroom/risingcompass/ on
// staging, which WAS launched and indexable.
//
// WHAT COUNTS AS A ROUTE. A directory containing index.html, which is exactly
// what `output: 'export'` emits per page. Comparing at that granularity rather
// than by filename is what keeps assets out of it: deploy.sh deliberately
// excludes ./portfolio/*.jpg and *.png from the sync, so those live in the build
// and not on the server. That is the opposite direction and not a ghost.
//
// A ROUTE DIRECTORY IS NOT ONLY A ROUTE. /portfolio/ is a dead route AND the
// directory every capture on the site is served from. --prune deletes page
// FILES, never directories, for exactly this reason. See the note down there
// before changing it.
//
// WHY IT DOES NOT PRUNE BY ITSELF. Deleting files on prod is not something a
// deploy should do silently on the strength of a diff. Wired into deploy.sh this
// reports and never blocks -- a ghost is a cleanup task, not a reason to refuse
// to ship new content, and the content in this build is fine. Pass --prune to
// actually remove them, which is a decision someone makes on purpose.
//
// Usage:
//   node scripts/ghost-audit.mjs [prod|staging] [--prune] [--only=/a/,/b/] [outDir]
//
// --only restricts the prune to the paths listed. It exists because the audit
// runs against the LOCAL build, which can be ahead of what is deployed, and a
// route caught mid-rename is a ghost that is still the live page. Pruning
// /showroom/risingcompass/ off prod before the new URL and its 301 had shipped
// would have 404'd an indexed page with no successor -- so the three genuinely
// dead routes were pruned and that one was held. Same situation, same flag.
//
// Exits 1 when ghosts are found (so it can gate in CI or a pre-flight), 0 when
// clean or after a successful --prune. deploy.sh calls it with `|| true`.

import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { join, relative, sep } from "node:path";

// Kept in step with deploy.sh by hand. Two constants, changed about never; a
// shared config file for them would be more machinery than the problem.
const SERVER = "deploy@138.197.111.66";
const DOCROOTS = {
  prod: "/srv/chadworks",
  staging: "/srv/chadworks-staging",
};

const args = process.argv.slice(2);
const prune = args.includes("--prune");
// --only=/a/,/b/ -- normalized to the same bare "a/b" keys the sets use, so it
// accepts what the report prints ("/ai-viz/") without the caller reformatting.
const onlyArg = args.find((a) => a.startsWith("--only="));
const only = onlyArg
  ? new Set(
      onlyArg
        .slice("--only=".length)
        .split(",")
        .map((s) => s.trim().replace(/^\//, "").replace(/\/$/, ""))
        .filter(Boolean)
    )
  : null;
const positional = args.filter((a) => !a.startsWith("--"));
const envArg = positional[0] && DOCROOTS[positional[0]] ? positional.shift() : "prod";
const OUT = positional[0] || "out";
const DOCROOT = DOCROOTS[envArg];

if (!existsSync(OUT)) {
  console.error(`ghost-audit: no build found at ${OUT}/ -- run npm run build first.`);
  process.exit(1);
}

/** Every route in the build: directories holding an index.html, as "a/b" keys. */
async function buildRoutes(dir, base = dir, acc = new Set()) {
  const entries = await readdir(dir, { withFileTypes: true });
  if (entries.some((e) => e.isFile() && e.name === "index.html")) {
    acc.add(relative(base, dir).split(sep).join("/"));
  }
  for (const e of entries) {
    if (e.isDirectory()) await buildRoutes(join(dir, e.name), base, acc);
  }
  return acc;
}

/**
 * The same set on the server. `find -name index.html -printf %h` gives the
 * holding directory directly, which keeps the parsing to a strip-and-split.
 * No sudo: deploy.sh chmods the docroot a+rX on every sync, so it is readable.
 */
function serverRoutes() {
  const cmd = `find ${DOCROOT} -name index.html -printf '%h\\n' 2>/dev/null || true`;
  const raw = execFileSync("ssh", [SERVER, cmd], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  return new Set(
    raw
      .split("\n")
      .map((l) => l.replace(/\r$/, "").trim())
      .filter(Boolean)
      .map((p) => p.replace(DOCROOT, "").replace(/^\//, ""))
  );
}

/** "" is the docroot itself, which is "/". Everything else gets both slashes. */
const toUrlPath = (route) => (route === "" ? "/" : `/${route}/`);

const built = await buildRoutes(OUT);

let live;
try {
  live = serverRoutes();
} catch (err) {
  // Never fail a deploy because the audit could not reach the box. It reports on
  // state the deploy did not create and cannot repair on its own.
  console.error(`ghost-audit: could not read ${SERVER}:${DOCROOT} -- ${err.message.split("\n")[0]}`);
  console.error("ghost-audit: skipped (not a deploy failure).");
  process.exit(0);
}

const ghosts = [...live].filter((r) => !built.has(r)).sort();

if (!ghosts.length) {
  console.log(
    `ghost-audit OK -- ${live.size} route(s) on ${envArg}, all present in the build.`
  );
  process.exit(0);
}

console.error(
  `\nghost-audit: ${ghosts.length} route(s) live on ${envArg} but NOT in this build.`
);
console.error(
  "These are serving their last deployed copy, with whatever robots directive was"
);
console.error(
  "baked in that day, and they are absent from the sitemap so nothing else flags them.\n"
);
for (const g of ghosts) console.error(`  ${toUrlPath(g)}`);

if (!prune) {
  console.error(`\nRemove them:  node scripts/ghost-audit.mjs ${envArg} --prune`);
  console.error(
    "Leave them ONLY if a redirect covers the path -- an nginx 301 runs before file"
  );
  console.error(
    "serving, so a mapped ghost is unreachable even while its files sit there.\n"
  );
  process.exit(1);
}

// --prune.
//
// NEVER `rm -rf` the route directory. A route directory is not necessarily only
// a route: /portfolio/ is a dead route (301'd to /showroom/ since 2026-07-15)
// AND the directory holding all 89 capture files the whole site renders from.
// Blowing the directory away would take every portfolio image with it. Caught
// on the first run of this script, which is the entire reason it removes files
// by name instead.
//
// So: delete only the artifacts `output: 'export'` emits for a page --
// index.html, index.txt, and the __next.* sidecars -- at depth 1 of that
// directory, then rmdir, which succeeds only if nothing else was in there.
// /portfolio/ therefore loses its stale page and keeps its captures.
//
// Routes come from `find` output on the box, not from anything user-supplied,
// but they are still built into a shell string, so anything outside a
// conservative character set is refused rather than escaped.
// --only narrows the target list. A name that matches no ghost is an error
// rather than a silent no-op: it means the caller is working from a stale
// report, and the difference between "already gone" and "typo" matters when the
// next thing you do is assume it was removed.
let targets = ghosts;
if (only) {
  const unknown = [...only].filter((o) => !ghosts.includes(o));
  if (unknown.length) {
    console.error(`\nghost-audit: --only named ${unknown.length} path(s) that are not ghosts here:`);
    for (const u of unknown) console.error(`  ${toUrlPath(u)}`);
    console.error("Re-run without --prune to see the current list.\n");
    process.exit(1);
  }
  targets = ghosts.filter((g) => only.has(g));
  const held = ghosts.filter((g) => !only.has(g));
  console.error(`\n--only: pruning ${targets.length}, HOLDING ${held.length}:`);
  for (const h of held) console.error(`  ${toUrlPath(h)}  (left in place)`);
}

const unsafe = targets.filter((g) => !/^[A-Za-z0-9._\-/]*$/.test(g));
if (unsafe.length) {
  console.error(`\nghost-audit: refusing to prune, unexpected characters in: ${unsafe.join(", ")}`);
  process.exit(1);
}

console.error(`\nPruning ${targets.length} route(s) from ${envArg} ...`);
console.error("(page files only -- a directory that also holds assets keeps them)\n");
const rmCmd = targets
  .map((g) => {
    const dir = `'${DOCROOT}/${g}'`;
    return (
      `sudo find ${dir} -maxdepth 1 \\( -name 'index.html' -o -name 'index.txt' ` +
      `-o -name '__next.*' \\) -exec rm -rf {} + ; ` +
      `sudo rmdir ${dir} 2>/dev/null || true`
    );
  })
  .join(" ; ");
execFileSync("ssh", [SERVER, rmCmd], { stdio: "inherit" });

const after = serverRoutes();
const left = [...after].filter((r) => !built.has(r));
const unexpected = left.filter((r) => !only || only.has(r));
if (unexpected.length) {
  console.error(`ghost-audit: ${unexpected.length} route(s) still present after prune.`);
  for (const g of unexpected) console.error(`  ${toUrlPath(g)}`);
  process.exit(1);
}
console.log(
  `ghost-audit: pruned ${targets.length}. ${after.size} route(s) on ${envArg}` +
    (left.length ? `, ${left.length} ghost(s) deliberately held.` : ", all present in the build.")
);
