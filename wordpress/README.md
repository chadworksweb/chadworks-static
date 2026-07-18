# wordpress/ — archived mu-plugins from the old chadworks.co WordPress site

chadworks.co ran on WordPress until the static cutover on 2026-07-02. The
`chadworks-wordpress` and `chadworks-mysql` containers were kept running as a
warm rollback afterwards, then torn down on 2026-07-18.

These three mu-plugins are the custom code from that install. They lived only
inside the container and were versioned nowhere, so they are preserved here
rather than lost with the teardown. **Nothing in this directory runs.** The live
site is the Next.js static export at the repo root.

## The files

| File | What it did |
|------|-------------|
| `leit-hide-login.php` | Renamed `wp-login.php` to a secret slug and 404'd `/wp-login.php` and `/wp-admin/*` for anonymous visitors |
| `leit-antispam-contact.php` | Spam filtering on the contact form |
| `resend-http-mailer.php` | Routed `wp_mail()` through the Resend HTTP API, because outbound SMTP is firewalled on the droplet |

None of them contain secrets. `leit-hide-login.php` reads its slug from a
`LEIT_HIDE_LOGIN_SLUG` constant, and `resend-http-mailer.php` reads
`RESEND_API_KEY`. Both constants lived in `wp-config.php`, which was never
committed anywhere and is gone with the container.

## The rest of the old site

The database and uploads are archived off the droplet, not in this repo:

    s3://crystopa-forge-backup1/le-projects-01/chadworks-wp-final-archive/
      chadworks-db-final-20260718.sql.gz        (2.2M, 30 tables, prefix szd_)
      chadworks-wp-content-final-20260718.tar.gz (1.2G, includes 3307 uploads)

Note the `szd_` table prefix if you ever restore that dump. It is not `wp_`.

## Restoring is not a rollback path

`wp-config.php` was not preserved, so its salts and the two constants above are
gone. A restore means a fresh WordPress install pointed at the archived
database, with new salts and the constants re-created. The Resend key would need
re-issuing from resend.com. Treat this as an archive to read, not a site to
switch back on.
