# democap — portfolio capture rig for the demos.chadworks.co interfaces

Records each nameless interface example driving itself, so the portfolio can show
the thing moving instead of a still. 1920x1080 h264 30fps, with the tab's real
audio where the demo has any.

Output lands in `Dropbox/ChadWorks/portfolio videos/`:

| File | Interface | Length | What it shows |
|------|-----------|--------|---------------|
| `demo-sap.mp4` | Streaming Audio Player | 15.5s | discography expand-all, playback, live spectrum, EQ band drag, volume down and back up, scrub, second track running ~5s to the end |
| `demo-tvp.mp4` | Traditional Video Player | 15s | two clips (featured panel loads one, grid loads the other), CRT playback + VHS overlay, scanline toggle, nested category filtering, VHS toggle |
| `demo-sfvv.mp4` | Short Form Vertical Video | 27s | swipe, unmute, like, four more swipes across clips and typed cards, category filter applied, four more swipes through the filtered cycle |

Each one loads a second piece of media partway through — a second track, a second
clip, a refiltered feed — and that needs real time on air rather than a glimpse.
SFVV runs longest by design: a feed has to be scrolled through to be shown at all,
so it walks the unfiltered feed, filters it, then walks the result.

## Run it

```
# from the chadworks-static repo root -- no separate server needed
node tools/democap/capture.mjs            # all three
node tools/democap/capture.mjs sap        # one
node tools/democap/capture.mjs all --framing   # screenshots only, no recording
```

The rig serves `chadworks-demos` itself on port 8899. Point it elsewhere with
`DEMOCAP_ROOT`, or skip its server entirely with `DEMOCAP_URL` — but read the byte
range note below before doing that.

`--framing` is the one to run after any demo CSS change: it writes a still of each
page as the rig will frame it, without spending a capture.

## Why it is built this way

Eight decisions that are not obvious, all of them found by measuring:

0. **The rig serves the demos itself, with byte ranges.** `python -m http.server`
   ignores `Range`, and without ranges a media element cannot seek past what it
   has already buffered. SAP's seek computes the correct position and sets
   `currentTime`; Chrome snaps it straight back to 0, which on camera looks
   exactly like the player restarting itself. It is intermittent — once the file
   is fully buffered the same seek works — which is what makes it look like a
   flaky player bug. It is not: the player is fine and the real host serves
   ranges through nginx. If you ever point `DEMOCAP_URL` at a python server, any
   seek beat will fail this way.

1. **Real Chrome, not Playwright's Chromium.** The bundled build ships without
   h264, aac, or mp3, so every clip and track in the demos refuses to decode.
   `channel: "chrome"` is not a preference here, it is the only thing that plays
   the media.

2. **getDisplayMedia + MediaRecorder, not Playwright `recordVideo`.** The
   recordVideo path is silent. Tab capture carries the tab's audio in sync, which
   means no post-mixing a soundtrack against a timeline and hoping it holds.

3. **The window is sized, not the viewport.** Tab capture grabs the real window
   content area in device pixels and ignores Playwright's viewport emulation
   entirely. So `--force-device-scale-factor=1` pins dpr to 1 and the window is
   nudged through CDP until `innerWidth`/`innerHeight` measure exactly 1920x1080.
   Set a viewport instead and the capture comes out at whatever the window
   happened to be (1826x938 on this machine).

4. **The cursor is drawn, not real.** The OS pointer sits inside the captured
   surface and Playwright's synthetic mouse never moves it. The rig parks the real
   pointer on the second display and injects an SVG cursor that glides and pulses
   on click, so the interaction reads on camera.

5. **The window is refit *after* capture starts, and the lead-in is trimmed.**
   Starting a tab capture drops Chrome's "sharing this tab" bar into the window,
   which steals content height. The page reflows and the track — pinned to
   1920x1080 by crop-and-scale — rescales to match, which on camera looks like the
   interface resizing itself a few frames in. So the rig starts recording, refits
   the window until inner is 1920x1080 again, lets it settle, and only then starts
   the clock. Everything before that mark is cut with a frame-accurate `-ss`.
   Skip this and every video opens with a visible jolt.

6. **Codec is chosen for encode cost, not quality.** VP9 at 1080p30 is software
   encoded here and could not keep up with SAP's 24-bar spectrum: a run came back
   43 frames short of 12s. The rig now prefers h264 in matroska (hardware
   encoded), then VP8, then VP9, and the encode forces `-fps_mode cfr` so a
   stalled stretch ships as held frames rather than a short video stream. The run
   log prints `frames n/360` and says so when a capture drops any.

7. **Scroll-snap is released during a programmed swipe.** The SFVV feed is
   `scroll-snap: y mandatory`, and Chrome re-snaps on every `scrollTop`
   assignment, so a per-frame animation gets yanked to the nearest slide and the
   travel never appears — the swipe reads as a hard cut. `scrollTo` drops snap for
   the duration of the move and restores it at the end, already on a snap point.

## Audio

Levels are matched across the set with **two-pass** loudnorm at -16 LUFS. Single
pass is a dynamic normalizer and barely moves quiet material — it left the TVP
clip 20 dB below the other two.

An audio *stream* is not audio. Most of the Pexels clips in the TVP and SFVV
fixtures carry a stream that is digital silence, so the rig measures the captured
track and ships the file with no audio at all rather than normalize nothing up to
-16 LUFS. That measurement is also why TVP headlines "Ridge In Cloud" (clip-11):
it is the only clip in that fixture with real audio on it.

## Choreography

Each demo's beats are a list of `{t, label, do}` keyed to milliseconds since the
clock started, and the runner holds each beat to its mark. Drift is the thing to
watch: if an action costs more than its slot, every beat after it slides and the
tail gets trimmed off the end of the video. The run log prints the real time each
beat fired, so compare that against the `t` values after changing anything.
Selector misses time out at 2.5s for the same reason.

**Pace it for a viewer, not for coverage.** Eight or nine beats is the ceiling at
12s. An earlier cut ran thirteen and read as twitchy — moves landed before the eye
could follow the last one. Glides of 500-600ms with 1.2-1.5s of dwell between
beats is the register that works. Cutting a beat is almost always better than
speeding two up.

Two selector traps, both already worked around, both worth knowing if you add
beats:

- TVP categories are rendered **twice**, once in the desktop panel and once in the
  hidden mobile dropdown. Scope to `#tvpGridCategoriesList` or the locator resolves
  to the invisible copy and waits until it times out.
- SFVV seeds its shuffle from `Date.now()`, so slide order changes every load. The
  rig rewrites that to a constant through `page.route` to keep runs comparable.
- SAP's seek bar binds a **click only**, no drag. `scrubSeek` presses on the handle
  and slides to the target, which reads as a scrub on camera, but the fill does not
  follow the pointer — it catches up when the click fires on release. That is the
  player's behavior, not a rig limitation.
- TVP's `playVideo()` smooth-scrolls the page to top on its own (twice, 400ms
  apart) and fires the channel-change static. Do not add a scroll-back beat after
  loading a clip from the grid — a driven scroll just fights it.
- SFVV's mute control exists only on video slides, and the feed opens on the
  featured card. One swipe always has to land before there is anything to unmute,
  which sets the floor on how early that beat can go.
- SFVV's filter costs four beats (menu, expand section, choose, apply) because the
  Feed Filter section starts collapsed. That sequence is what decides how soon the
  filter can land, so order everything else around it.
- A filtered SFVV cycle is short. Street holds 3 clips, and `buildCycle` wraps them
  as featured card + 3 clips + one more card = 5 slides, so four swipes walks it end
  to end. Swiping past that opens a fresh cycle with a new seed.

## Framing

SAP and TVP are zoomed (1.85 and 1.42) to fill the frame — the pages center a
fixed-width app in a 1920 viewport and would otherwise sit small in the middle.
SFVV is left at 1.0: its phone is sized off viewport height, so zooming overflows
the frame, and the margins around the 9:16 column are what the page actually looks
like.
