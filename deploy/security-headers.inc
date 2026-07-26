# Security headers for chadworks.co (migrated from vercel.json "headers").
# Included in every response-serving block. NOTE: nginx drops ALL inherited
# add_header directives in any block that sets its own add_header, so this
# snippet is included explicitly in each such location (e.g. /_next/static/).

add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), browsing-topics=()" always;
add_header X-DNS-Prefetch-Control "on" always;
# worker-src: the homepage hero art runs in a Web Worker (public/codefall-worker.js,
# see src/components/art/CodeFall.tsx). Without a worker-src the browser falls back
# to default-src, which happens to allow it here, so this line is documentation of a
# real dependency rather than a change in effect. It is spelled out so a future edit
# to default-src cannot silently blank the hero. NOTE it is 'self' and NOT blob:
# deliberately: a Blob-URL worker was tried first, was blocked by this policy, and
# because the canvas is transferred before the worker loads the hero went permanently
# blank with no error (2026-07-23).
#
# GA4 + consent geo: the original policy was script-src 'self' with connect-src
# 'self', which silently killed BOTH halves of analytics from 2026-07-13 (the
# vercel.json -> nginx migration) until 2026-07-24. gtag.js could not load, and
# the consent geo lookup to leit.libraengine.com threw a NetworkError, so
# fetchGeoDefault() failed closed and every visitor stayed at analytics:0 even
# in opt-out regions. Neither failure logs anything a visitor or an uptime check
# would notice; the only symptom was GA4 going quiet. The three hosts below are
# the full set gtag needs: googletagmanager serves the library, the
# google-analytics / analytics.google.com hosts receive the hits (GA4 picks a
# regional collector at runtime, hence the wildcards), and leit.libraengine.com
# is the geo endpoint in src/lib/consent.ts.
#
# NOTE analytics.google.com is listed BOTH bare and wildcarded on purpose: a CSP
# wildcard matches subdomains only, never the apex, and GA4 posts to the apex.
# Listing only *.analytics.google.com silently drops those hits (2026-07-24).
#
# Deliberately NOT allowed: stats.g.doubleclick.net and www.google.com, the
# Google Signals advertising endpoints. Core measurement does not need them and
# they are the ad-tech half of GA4. They will keep logging CSP errors in the
# console until Google Signals is switched off in the GA4 admin.

add_header Content-Security-Policy "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; worker-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://leit.libraengine.com; upgrade-insecure-requests" always;
