---
title: ""
date: 2026-07-17
dek: ""
# description: ""   # optional; the meta description AND the llms.txt line. Falls back to dek when blank
# image: "/essays/your-image.jpg"   # optional featured image, shown 1200x630 on the archive card
# imageAlt: ""
# section: "Essays"   # optional; becomes articleSection
# GEO fields below. Fill both. An essay that leaves them empty is far less
# likely to get quoted by an AI answer surface. See the GEO notes in the comment.
# Empty strings are dropped, so delete the spare slots you do not use.
topics: # becomes schema keywords + about (Thing nodes). Three to six.
  - ""
  - ""
  - ""
  - ""
takeaways: # renders "The short version" + feeds speakable. Three. Not four.
  - ""
  - ""
  - ""
---

<!--
  ESSAY TEMPLATE -- how to use (delete this whole comment before saving a real essay)

  1. Copy this file. Rename it to your slug, e.g. content/essays/the-death-of-the-interchangeable-website.md
     (the filename IS the URL: /essays/<filename>).
  2. Fill the frontmatter above: title, date, dek (the one-line hook that sits under
     the title -- the single sentence that makes an intelligent reader stop).
  3. Write the essay in Google Docs.
  4. In Google Docs: Edit > Copy as Markdown  (or File > Download > Markdown).
     Paste the markdown BELOW this comment, replacing the scaffold.
     DO NOT plain-copy-paste -- that loses all formatting. Use Copy as Markdown.
  5. Do NOT paste the title as a heading in the body -- the title comes from the
     frontmatter, so an H1 in the body would double it. Start with your first line.
  6. Delete this comment. Save. Ship with deploy.sh.

  WHAT CARRIES OVER FROM GOOGLE DOCS: headings, **bold**, *italics*, lists, links,
  > blockquotes, ordered lists. WHAT DOES NOT (by design): Google Docs fonts,
  colors, sizes -- the site applies its own typography.

  LENGTH: manifesto length, ~300 to 400 words. Short, dense, punchy. Not long-form.

  GEO (getting quoted by AI answers):
  - `takeaways:` is the highest-leverage field. Exactly three, no more. Write
    each one as a sentence that is still true and still attributable after
    somebody lifts it out of the essay. If it needs the paragraph around it to
    make sense, rewrite it. The cap is the point: three claims an answer engine
    can carry beat six it has to choose between.
  - `topics:` are the entities the essay is about, not keywords to rank for.
    Three to six, named the way a person would say them.
  - Use ## headings when the essay has real sections. Every h2 and h3 gets an
    automatic anchor id, which is what lets an answer engine cite one section
    instead of the whole page. No headings is fine for a short manifesto.
  - public/llms.txt updates itself. `npm run build` regenerates the ## Essays
    section from these files (scripts/sync-llms-essays.mjs), so nothing to do.
    The line reads from `description:`, falling back to `dek:` -- there is no
    separate llms summary field, so make the description say what the piece
    ARGUES, not what it is about. It has to earn a click on both surfaces.
    The rest of llms.txt is still hand-written; only this section is generated.

  THE BAR (every essay must clear it before it ships): only chadworks could have
  written this, and it makes an intelligent reader stop and think. Not an SEO
  article, not a trends listicle, not anything interchangeable.

  SHAPE CUES (a reference, not a form -- write it your way):
  - Open where the tension is. No windup, no "in today's world."
  - One idea, pushed hard. A manifesto-length piece earns one turn, not five.
  - Land the claim the reader leaves with. The reframe is the payload.
-->

Opening line goes here.

Body.

Closing turn.
