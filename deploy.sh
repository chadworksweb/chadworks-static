#!/usr/bin/env bash
# Deploy the chadworks-static homepage to le-projects-01 (/srv/chadworks).
# Served by the shared le-nginx proxy via conf.d/chadworks.conf (static root,
# reuses the existing chadworks.co Let's Encrypt cert). The live site tracks the
# `consolidate` branch: one branch, one source of truth. What is public is
# controlled by src/lib/launch.ts (the LAUNCHED set of routes) -- no sealed
# branch. Run from the repo root: bash deploy.sh
#
# Rollback: the WordPress site is still intact -- chadworks-wordpress +
# chadworks-mysql containers stay running, and the pre-cutover vhost is saved as
# /root/proxy/nginx/conf.d/chadworks.conf.bak-before-static-*. To revert, restore
# that .bak over chadworks.conf and reload le-nginx.
set -euo pipefail

SERVER="deploy@138.197.111.66"
DOCROOT="/srv/chadworks"

cd "$(dirname "$0")"

BRANCH="$(git branch --show-current)"
echo "Branch: ${BRANCH}"
echo "Building static export (next build -> out/) ..."
npm run build >/dev/null
echo "Built $(find out -type f | wc -l) files."

echo "Syncing out/ -> ${SERVER}:${DOCROOT}"
# Additive tar-sync (like the libra-engine-site deploy): extracts/overwrites but
# does NOT prune. Next hashes its build assets, so stale /_next/static files just
# accumulate harmlessly; sweep them by hand if the docroot grows: on the server
# `sudo rm -rf /srv/chadworks/_next` before a deploy, then redeploy.
tar czf - -C out . \
  | ssh "$SERVER" "sudo tar xzf - -C ${DOCROOT} && sudo chmod -R a+rX ${DOCROOT}"

echo "Verifying (public):"
curl -s -o /dev/null -w '  /            -> %{http_code}\n' https://chadworks.co/
curl -s -o /dev/null -w '  /about/      -> %{http_code}\n' https://chadworks.co/about/
curl -s -o /dev/null -w '  404 (/nope/) -> %{http_code}\n' https://chadworks.co/__nope__/

echo "Done. Live: https://chadworks.co/"
