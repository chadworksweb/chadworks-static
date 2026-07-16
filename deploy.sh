#!/usr/bin/env bash
# Deploy chadworks-static to le-projects-01. Two environments:
#   bash deploy.sh            -> PRODUCTION  (branch master  -> /srv/chadworks         -> https://chadworks.co)
#   bash deploy.sh staging    -> STAGING     (branch staging -> /srv/chadworks-staging -> https://staging.chadworks.co)
#   bash deploy.sh config     -> NGINX VHOST (deploy/*.conf  -> le-nginx conf.d, test + reload; content untouched)
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
  config)
    # Push the nginx vhosts (prod + staging + shared security headers) from
    # deploy/ to le-nginx's conf.d and reload. Content is NOT touched. Backs up
    # each current file, tests the new config, and auto-restores if the test
    # fails. All three go together: chadworks-staging.conf CONSUMES the
    # $cw_redirect map that chadworks.conf declares, so pushing one without the
    # other can leave conf.d referencing an undefined variable.
    cd "$(dirname "$0")"
    echo "Syncing deploy/chadworks.conf + chadworks-staging.conf + security-headers.conf -> ${SERVER}"
    scp deploy/chadworks.conf deploy/chadworks-staging.conf deploy/security-headers.conf "$SERVER":/tmp/
    ssh "$SERVER" 'set -e
      TS=$(date +%Y%m%d%H%M%S); D=/root/proxy/nginx/conf.d
      sudo cp $D/chadworks.conf $D/chadworks.conf.bak-before-redirects-$TS
      [ -f $D/chadworks-staging.conf ] && sudo cp $D/chadworks-staging.conf $D/chadworks-staging.conf.bak-$TS || true
      [ -f $D/security-headers.conf ] && sudo cp $D/security-headers.conf $D/security-headers.conf.bak-$TS || true
      sudo cp /tmp/chadworks.conf $D/chadworks.conf
      sudo cp /tmp/chadworks-staging.conf $D/chadworks-staging.conf
      sudo cp /tmp/security-headers.conf $D/security-headers.conf
      if sudo docker exec le-nginx nginx -t; then
        sudo docker exec le-nginx nginx -s reload
        echo "nginx reloaded (rollback: chadworks.conf.bak-before-redirects-$TS)"
      else
        echo "nginx -t FAILED -- restoring previous vhosts"
        sudo cp $D/chadworks.conf.bak-before-redirects-$TS $D/chadworks.conf
        [ -f $D/chadworks-staging.conf.bak-$TS ] && sudo cp $D/chadworks-staging.conf.bak-$TS $D/chadworks-staging.conf || true
        [ -f $D/security-headers.conf.bak-$TS ] && sudo cp $D/security-headers.conf.bak-$TS $D/security-headers.conf || true
        exit 1
      fi'
    echo "Done. Verify: curl -sI https://chadworks.co/blog"
    exit 0;;
  *)
    echo "usage: bash deploy.sh [prod|staging|config]"; exit 1;;
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
# Non-fatal: don't let a failed curl abort a deploy whose files already synced.
set +e
curl -s -o /dev/null -w '  /            -> %{http_code}\n' "${BASE}/"
curl -s -o /dev/null -w '  /about/      -> %{http_code}\n' "${BASE}/about/"
curl -s -o /dev/null -w '  404 (/nope/) -> %{http_code}\n' "${BASE}/__nope__/"
set -e

echo "Done. Target: ${BASE}/  (${DOCROOT})"
