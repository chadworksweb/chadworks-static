<?xml version="1.0" encoding="UTF-8"?>
<!--
  Branded human view for /sitemap.xml. Browsers apply this XSLT when a person
  opens the sitemap; search engines ignore it and read the raw XML. On-brand
  chadworks styling: Lexend display, Instrument Sans body, purple accent.
-->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes"
    doctype-system="about:legacy-compat"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex, follow"/>
        <title>chadworks - XML sitemap</title>
        <!-- No external font fetch: the site CSP (font-src 'self' data:) blocks
             Google Fonts. Brand faces are named first, then a system fallback. -->
        <style>
          :root{
            --bg:#ffffff; --surface:#ede7f6; --ink:#333333; --muted:#6b6577;
            --accent:#8054bc; --deep:#361e9c; --line:#e2dbef;
            --display:'Lexend',system-ui,sans-serif;
            --body:'Instrument Sans',system-ui,sans-serif;
            --mono:'JetBrains Mono',ui-monospace,monospace;
          }
          *{box-sizing:border-box;}
          body{
            margin:0; background:var(--bg); color:var(--ink);
            font-family:var(--body); line-height:1.5;
            -webkit-font-smoothing:antialiased;
          }
          .wrap{max-width:960px; margin:0 auto; padding:clamp(1.5rem,4vw,3rem);}
          header{
            background:linear-gradient(180deg,var(--surface),transparent);
            border:1px solid var(--line); border-radius:18px;
            padding:clamp(1.25rem,3vw,2rem); margin-bottom:1.75rem;
          }
          .brand{
            font-family:var(--display); font-weight:800; letter-spacing:-0.02em;
            font-size:clamp(1.5rem,4vw,2rem); color:var(--deep); margin:0;
          }
          .brand sup{font-size:0.5em; vertical-align:super; color:var(--accent);}
          h1{
            font-family:var(--display); font-weight:600; letter-spacing:-0.01em;
            font-size:clamp(1.05rem,2.4vw,1.35rem); margin:0.5rem 0 0.25rem;
          }
          .lede{margin:0; color:var(--muted); max-width:60ch;}
          .count{
            display:inline-block; margin-top:0.9rem; padding:0.3rem 0.7rem;
            font-family:var(--mono); font-size:0.8rem; color:var(--deep);
            background:#fff; border:1px solid var(--line); border-radius:999px;
          }
          .card{
            border:1px solid var(--line); border-radius:18px; overflow:hidden;
            background:#fff;
          }
          table{width:100%; border-collapse:collapse; font-size:0.94rem;}
          thead th{
            text-align:left; font-family:var(--mono); font-weight:500;
            font-size:0.72rem; letter-spacing:0.08em; text-transform:uppercase;
            color:var(--muted); background:var(--surface);
            padding:0.85rem 1.1rem; border-bottom:1px solid var(--line);
          }
          tbody td{padding:0.85rem 1.1rem; border-bottom:1px solid var(--line); vertical-align:middle;}
          tbody tr:last-child td{border-bottom:0;}
          tbody tr:hover{background:#faf8fe;}
          a.loc{
            font-family:var(--mono); font-size:0.9rem; color:var(--accent);
            text-decoration:none; word-break:break-all;
          }
          a.loc:hover{color:var(--deep); text-decoration:underline;}
          .col-meta{font-family:var(--mono); font-size:0.82rem; color:var(--muted); white-space:nowrap;}
          .num{text-align:right;}
          footer{margin-top:1.5rem; color:var(--muted); font-size:0.82rem;}
          footer a{color:var(--accent);}
          @media (max-width:640px){
            .hide-sm{display:none;}
            a.loc{font-size:0.82rem;}
          }
          @media (prefers-color-scheme:dark){
            :root{
              --bg:#141018; --surface:#241a33; --ink:#ece7f4; --muted:#a99fc0;
              --line:#33294a; --accent:#b58cf0; --deep:#c9a9ff;
            }
            .count,.card{background:#1c1626;}
            tbody tr:hover{background:#221a30;}
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <header>
            <p class="brand">chadworks<sup>&#8482;</sup></p>
            <h1>XML sitemap</h1>
            <p class="lede">This is the machine-readable index search engines use to find the pages on this site. The list below is the same data, made readable.</p>
            <span class="count">
              <xsl:value-of select="count(s:urlset/s:url)"/>
              <xsl:text> URL</xsl:text>
              <xsl:if test="count(s:urlset/s:url) != 1"><xsl:text>s</xsl:text></xsl:if>
            </span>
          </header>

          <div class="card">
            <table>
              <thead>
                <tr>
                  <th>URL</th>
                  <th class="hide-sm">Last modified</th>
                  <th class="hide-sm">Frequency</th>
                  <th class="num">Priority</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="s:urlset/s:url">
                  <tr>
                    <td>
                      <a class="loc" href="{s:loc}">
                        <xsl:value-of select="s:loc"/>
                      </a>
                    </td>
                    <td class="col-meta hide-sm">
                      <xsl:value-of select="substring(s:lastmod,1,10)"/>
                    </td>
                    <td class="col-meta hide-sm">
                      <xsl:value-of select="s:changefreq"/>
                    </td>
                    <td class="col-meta num">
                      <xsl:value-of select="s:priority"/>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <footer>
            Generated for <a href="https://chadworks.co/">chadworks.co</a>. Search engines read the raw XML; this styled view is for people.
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
