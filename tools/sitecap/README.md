# sitecap — portfolio capture rig for live client sites

Records a client site driving itself, so the portfolio can show the thing working
instead of a still. Same capture surface as `tools/democap/` (real Chrome, tab
capture, drawn cursor, 1920x1080 h264 30fps); the target is a live public site
walked end to end rather than a single-page demo.

Output lands in `Dropbox/ChadWorks/portfolio videos/`.

| File | Site | Length | What it shows |
|------|------|--------|---------------|
| `oakcourtpress.mp4` | oakcourtpress.com | 60s | homepage top to bottom, chapter index (free previews into padlocked chapters), a free chapter in the reader, text-size controls, two page turns, the paywall on a locked chapter, and the account form the paywall routes to |
| `tomtheweatherwizard-weather-fx.mp4` | tomtheweatherwizard.com | 34s | the seven weather effects: four fired from the season lines in "Spring? Yeah Right!", the running one carried down to the shirt, then the rest from the shirt's own Weather FX row |
| `chadlewine-cube-machine.mp4` | chadlewine.com | 42s | **has sound.** The song page's CubeVisualizer: flat cover art, then "Machine" starts and the art unfolds into a cube the track drives, six seconds in the page and the rest fullscreen |

## Run it

```
node tools/sitecap/capture.mjs ocp             # record
node tools/sitecap/capture.mjs ocp --recon     # headless: prove every selector, measure the pages
node tools/sitecap/capture.mjs ocp --framing    # one still, framed as the take will be
```

Sites: `ocp`, `ttww`, `clcube`.

`--recon` is the one to run first, and again after the client site ships
anything. It loads each surface the take visits, counts every selector the
choreography drives, and prints each page's height and section offsets. A headed
take costs ninety seconds of wall time and the whole screen; a selector that
moved should never be discovered inside one.

## What is different from democap

- **The target is remote.** No local server, so democap's byte-range problem does
  not apply, but network time does. Every navigation is its own beat that WAITS
  for a landing selector instead of sleeping a guessed interval, and the run log
  prints what each one actually cost.
- **Client-side routing keeps the injected kit alive.** The site is a Next.js App
  Router app, so every in-take link is a client transition and the drawn cursor
  survives. `ensureKit()` re-injects before each move anyway, in case a link ever
  hard-navigates.
- **Scroll targets are selectors, not pixels.** `scrollToEl(sel, frac, ms)` puts
  an element a given fraction down the viewport. Absolute numbers would need
  re-measuring every time the client edits their copy.
- **Nothing is submitted.** This is production. See the note on checkout below.

## Notes that decided the Oak Court Press choreography

- **The chapter index animates slower than it scrolls.** Every card is a `FadeIn`
  with `delay = index * 0.1s`, counted from when it enters view, so card 40
  arrives four seconds after being scrolled to. A single long scroll down a
  72-chapter grid films a half-empty page. The take uses two shortish scrolls
  with a dwell between them, and 2.2s of dwell at the deeper one, because the
  last row in that frame is chapters 16-18 and their fades are delayed 1.5-1.7s.
  If chapters are added ahead of chapter 16, re-check that beat.
- **Clicking "Unlock the Full Story" is safe on prod.** Logged out, `POST
  /api/checkout` answers 401 before it touches Stripe, and the app routes itself
  to `/signup`. No checkout session is created, no email is sent. That is also
  what gives the take its ending: the signup form with the slide-puzzle
  verification on it.
- **Do not scroll to the foot of a chapter page.** A chapter is barely taller
  than two screens, so scrolling to `#chapter-nav` pins against the bottom and
  the shot is mostly footer under a band of empty green. Stop at `#page-nav`
  instead, and go back to the index through the fixed header rather than the
  in-page "All Chapters" link.
- **Nothing is scheduled across a page turn.** The reader smooth-scrolls itself
  to y=300 on every turn, so a driven scroll overlapping one just fights it.
- **The site is silent.** The hero and chapter-intro videos are muted decoration.
  The rig measures the captured track rather than assuming, finds -91 dB, and
  ships the file with no audio stream at all.

## Notes that decided the Tom The Weather Wizard choreography

- **The take opens already at the season section.** It is the sixth section down
  and one viewport tall, and the scroll to reach it shows nothing the video is
  about. The site's `open()` hook jumps the page there with `scroll-behavior`
  forced to `auto`, and it runs after the post-capture window refit, so the jump
  itself sits inside the trimmed lead-in and never reaches the video.
- **3.2s an effect, no less.** Each click crossfades the section's background
  photo over 800ms (`--duration-dramatic`) and starts a full-page particle field.
  Cut sooner and the shot leaves while the crossfade is still resolving.
- **The heat wave is left running across the scroll to the shirt.** The effects
  are fixed to the viewport rather than to the section that started them, and
  carrying one down is the clearest way to show it.
- **The seven effects exist in two places.** Season lines in the intro, and the
  Weather FX row above the shirt. They are the same seven; `FX` maps each to its
  line index and its button `aria-label` so a beat can fire either one.

**Found, not fixed:** the Weather FX row's "off" ✕ reads as lit while an effect
started from a season line is running. `WeatherFxMenu` keeps its own `active`
state, which starts `null`, and its sync effect early-returns on `!active`, so it
never learns about weather it did not start. Visible in the capture at ~16s. The
ask was a video, so nothing in the client repo was touched.

## Notes that decided the chadlewine cube

- **This is the first entry in the folder with audio.** The capture surface has
  always requested a stereo track; the two takes before this one measured it,
  found silence, and shipped `-an`. Here it measures -20.3 dB, so the site sets
  `loudnorm: true` and the encode lands at -16 LUFS / -1.5 dBTP instead of
  shipping whatever level the page's gain staging happened to produce.
- **Fullscreen does not move the window.** `.cube-vis` uses the real Fullscreen
  API, and `innerWidth`/`innerHeight` stay 1920x1080 across the transition, so
  the capture track never rescales. That was measured in a throwaway headed run
  before the take, because a mid-take rescale is the one artifact this rig
  cannot fix in post.
- **The unfold is the beat, so do not waste it.** The cube is flat cover art
  until the track plays; it unfolds on the first note. The take rests on the
  flat art for two and a half seconds first, so the change is something the
  video shows rather than something it opens on.
- **Dismiss the consent bar in `ready()`.** It is a fixed strip across the foot
  of the frame and sits in the entire in-page half otherwise. "Reject optional",
  not "Accept all": the rig is not a visitor, and accepting has it firing GA4
  events as one.
- **`cropdetect` is not flat here, and that is content.** The fullscreen half is
  a lit cube on a near-black ambient field, so the detector walks in on dark
  frames. The stream is 1920x1080 throughout and the in-page half returns
  `1920:1080:0:0`.
- **The song page rate-limits anonymous playback, and capture runs count.** Two
  full plays per song per `sha256(ip | user-agent)`; the third opens on a "free
  play limit reached" modal instead of the cube, and the take ships silent.
  `uaTag` puts capture runs in their own bucket rather than the operator's, and
  labels them for what they are. Not an unlimited bypass: two takes per tag. See
  `src/app/api/play/gate/route.ts` in the chadlewine repo.
- **Playback is the full track, not a preview.** The mini player's aria-label
  reads `Play ` rather than `Play preview`. `PlayerContext` routes a `new
  Audio()` element that never enters the DOM through an AudioContext, so
  `document.querySelectorAll("audio")` returns nothing -- check
  `.cube-vis.is-playing` instead.

## Adding a site

Add an entry to `SITES`: `url`, `out` (filename), `target` (seconds), a `ready()`
that waits for whatever must be on screen before the first beat, and `beats()`.
Then extend `recon()` with that site's surfaces and selectors. The driver
(`click`, `hover`, `scrollY`, `scrollTo`, `landed`) is shared.

Optional per site: `warm[]` (extra routes to cache before the clock starts),
`open()` (runs after the post-capture window refit, so a site can start the take
partway down the page), `loudnorm: true` (normalize the captured audio to -16
LUFS; without it a site with sound ships at whatever level it produced, and a
site measured below -60 dB ships with no audio stream at all), and `uaTag` (a
suffix appended to the user-agent, for sites that rate-limit anonymous
visitors).
