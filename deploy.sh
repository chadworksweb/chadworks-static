#!/usr/bin/env bash
# Deploy chadworks-static to le-projects-01. Two environments:
#   bash deploy.sh            -> PRODUCTION  (branch master  -> /srv/chadworks         -> https://chadworks.co)
#   bash deploy.sh staging    -> STAGING     (branch staging -> /srv/chadworks-staging -> https://staging.chadworks.co)
#
# Terminology: local/development = `npm run dev` on the staging branch; staging =
# the deployed staging site; master = production. Both are served by the shared
# le-nginx proxy (conf.d/chadworks.conf + chadworks-staging.conf). What is public
# is controlled by src/lib/launch.ts (the LAUNCHED set) -- no sealed branch.
#
# Rollback (prod): the WordPress site is still intact -- chadworks-wordpress +
# chadworks-mysql containers stay running, and the pre-cutover vhost is saved as
# /root/proxy/nginx/conf.d/chadworks.conf.bak-before-static-*. To revert, restore
# that .bak over chadworks.conf and reload le-nginx.
set -euo pipefail

SERVER="deploy@138.197.111.66"

ENV="${1:-prod}"
case "$ENV" in
  prod|production|master)
    DOCROOT="/srv/chadworks"; BASE="https://chadworks.co"; EXPECT="master";;
  staging|stage)
    DOCROOT="/srv/chadworks-staging"; BASE="https://staging.chadworks.co"; EXPECT="staging";;
  *)
    echo "usage: bash deploy.sh [prod|staging]"; exit 1;;
esac

cd "$(dirname "$0")"

BRANCH="$(git branch --show-current)"
if [ "$BRANCH" != "$EXPECT" ]; then
  echo "WARNING: on branch '${BRANCH}' but deploying to ${ENV} (expected '${EXPECT}')."
  echo "         Ctrl-C within 4s to abort; otherwise deploying the current tree."
  sleep 4
fi

echo "Env: ${ENV}  Branch: ${BRANCH}  ->  ${DOCROOT}"
echo "Building static export (next build -> out/) ..."
npm run build >/dev/null
echo "Built $(find out -type f | wc -l) files."

echo "Syncing out/ -> ${SERVER}:${DOCROOT}"
# Additive tar-sync (like the libra-engine-site deploy): extracts/overwrites but
# does NOT prune. Next hashes its build assets, so stale /_next/static files just
# accumulate harmlessly; sweep them by hand if the docroot grows: on the server
# `sudo rm -rf ${DOCROOT}/_next` before a deploy, then redeploy.
ssh "$SERVER" "sudo mkdir -p ${DOCROOT}"
tar czf - -C out . \
  | ssh "$SERVER" "sudo tar xzf - -C ${DOCROOT} && sudo chmod -R a+rX ${DOCROOT}"

echo "Verifying (${ENV}):"
curl -s -o /dev/null -w '  /            -> %{http_code}\n' "${BASE}/"
curl -s -o /dev/null -w '  /about/      -> %{http_code}\n' "${BASE}/about/"
curl -s -o /dev/null -w '  404 (/nope/) -> %{http_code}\n' "${BASE}/__nope__/"

echo "Done. Live: ${BASE}/"
