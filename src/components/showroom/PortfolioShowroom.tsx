"use client";

// Portfolio showroom shell (Track A). The CW crystal sits at the XY center. On
// load the page is NOT locked: the gem floats as the entry, glowing on hover.
// Clicking it enters the immersive showroom (locks the viewport) and triggers the
// cold open the first time. Inside: the reel slides vertically behind the gem and
// refracts through it; a tap promotes the centered item to the front; a right
// rail navigates. Esc releases the lock back to normal page flow; clicking the
// gem re-enters. Picks WebGL vs a lite gallery; always keeps a crawlable list.

import { Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Reel } from "./Reel";
import { TileWall } from "./TileWall";
import { CrystalGem } from "./CrystalGem";
import { SHOWROOM_ITEMS, type ShowroomItem } from "./showroom-data";
import type { ShowroomMode } from "./useShowroomMode";
import {
  intro,
  startIntro,
  skipIntro,
  INTRO_DURATION,
  entrance,
  startEntrance,
  skipEntrance,
  advanceStage,
  STAGE_SECONDS,
  ENTRANCE_DURATION,
} from "./showroom-intro";
import { prefersReducedMotion, isMotionPaused, setMotionPaused } from "@/lib/motion";
import { captureSrc } from "@/lib/captures";
import styles from "./showroom.module.css";

// A title is ALWAYS one line -- it never wraps, at any width. Shrink it until it fits
// its container and hand the CSS the size as `--fit-fs` (unset = the CSS clamp, i.e.
// the text already fits). Re-runs on text change and on resize.
//
// `grow`: the box widens to ACCOMMODATE the title rather than shrinking it. The card
// buys whatever width the title's length asks for (as `--fit-w`; CSS max-width caps how
// far), so the type holds its size and the card varies instead. Shrinking is the last
// resort, for when even the ceiling is not enough -- a title is always one line.
//
// The ratio is what the card is willing to let the title shrink to BEFORE it buys
// width. At 1 it never trades type size for width until it has spent every pixel it
// can. It is a ratio of the title's own base size, not a pixel: the base is a clamp, so
// a fixed floor would sit above the base on a narrow viewport and widen the card for a
// title that fits fine.
const MIN_FIT_RATIO = 1;
function useFitText(dep: string, grow = false, active = true) {
  const ref = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Docked: the CSS owns the collapsed size (it outranks --fit-fs), and the card
    // keeps the width the expanded title earned. Measuring here would read the small
    // docked title and hand the card back a width it has to undo on expand.
    if (!active) return;
    const box = el.parentElement ?? el;
    const fit = () => {
      // Measure with transitions OFF. The title carries `transition: font-size 0.5s`
      // for the collapse dock, so clearing --fit-fs does not snap to the base size --
      // it starts a 0.5s ride toward it, and both readings below would be taken from a
      // value still in flight. Suppressing the transition makes the measurement mean
      // what it says, and lands the correction instantly (only the collapse is meant
      // to animate). Restored after a flush, so the settle itself never transitions.
      el.style.transition = "none";
      el.style.setProperty("--fit-fs", ""); // reset to the CSS default, then measure
      if (grow) box.style.setProperty("--fit-w", ""); // measure against the standard card
      // The title's OWN content width, not the card's minus padding: whatever else
      // takes room on that row (the corner's reserve) is already priced in here.
      let avail = el.clientWidth;
      const natural = el.scrollWidth; // one line, so this is the text's true width
      if (avail > 0 && natural > avail) {
        const base = parseFloat(getComputedStyle(el).fontSize);
        // Past the floor, buy the card exactly the width the title is SHORT BY, then
        // read back what it was actually allowed (max-width may cap it). The deficit
        // is measured from the standard card and the title's natural width, never
        // from the width this just set, so there is nothing to oscillate.
        const need = natural * MIN_FIT_RATIO;
        if (grow && avail < need) {
          box.style.setProperty("--fit-w", `${Math.ceil(box.offsetWidth + (need - avail))}px`);
          avail = el.clientWidth;
        }
        if (natural > avail) {
          el.style.setProperty("--fit-fs", `${Math.max(10, base * (avail / natural))}px`);
        }
      }
      void el.offsetWidth;
      el.style.transition = "";
    };
    fit();
    const raf = requestAnimationFrame(fit); // layout can settle a frame late
    // The FONT settles much later than a frame, and it moves `natural` -- the whole
    // measurement. Nothing else catches that: the observer below is width-gated, and by
    // then --fit-w has PINNED the card's width, so swapping the font changes the text
    // without ever changing the box, and the stale fit stands. Re-fit once the fonts
    // are actually in. (`ready` also resolves immediately if they already are.)
    let live = true;
    const onFonts = () => live && fit();
    document.fonts?.ready.then(onFonts);
    document.fonts?.addEventListener("loadingdone", onFonts);
    // Only WIDTH can change the answer (`avail` is a width). Re-fitting on HEIGHT is a
    // feedback loop: the fit changes the title's size, which changes the box's height,
    // which fires this, which fits again -- and the body's own max-height transition
    // drives the same loop on every frame it animates.
    let lastW = -1;
    const ro = new ResizeObserver((entries) => {
      const w = entries[entries.length - 1]?.contentRect.width ?? -1;
      if (w === lastW) return;
      lastW = w;
      fit();
    });
    ro.observe(box);
    return () => {
      live = false;
      cancelAnimationFrame(raf);
      document.fonts?.removeEventListener("loadingdone", onFonts);
      ro.disconnect();
    };
  }, [dep, grow, active]);
  return ref;
}

function FitText({
  as: Tag = "span",
  className,
  text,
  grow = false,
  active = true,
}: {
  as?: "span" | "h2";
  className?: string;
  text: string;
  /** Let the parent widen (via --fit-w) rather than shrink this past MIN_FIT_RATIO. */
  grow?: boolean;
  /** False while the parent is docked: hold the last fit rather than re-measure. */
  active?: boolean;
}) {
  const ref = useFitText(text, grow, active);
  return (
    <Tag ref={ref as React.Ref<HTMLHeadingElement & HTMLSpanElement>} className={className}>
      {text}
    </Tag>
  );
}

// The entered-state lift lives on the GEM now (see CrystalGem's STAGE_SHIFT_FRAC). It
// used to be a camera lens-shift here, but that shifts the whole projection: the wall
// and the reel rode up with the mark. Only the mark is supposed to move.

// How long the immersive chrome stays mounted after the lock releases, so it can play
// its exit. THE GEM IS THE NORTH STAR: this is its crossfade (STAGE_SECONDS) plus a
// hair, so the frame, the rail and the module all finish with the crystal rather than
// being cut off mid-move. Keep in step with --stage-ms in the CSS.
const CHROME_OUT_MS = STAGE_SECONDS * 1000 + 60;

// The rail's slide-in is the same move as the crossfade, so it arrives on the gem's
// clock too. Only for one crossfade, though: after that every shift of the strip is
// navigation, which is a different job and keeps its own snappier curve.
const RAIL_IN_MS = STAGE_SECONDS * 1000;

// Advances the clocks: `entrance` (the gem's reverse-shatter, on load), `intro` (the
// reel's ramp, on enter) -- both one-shots, deliberately separate, see showroom-intro
// -- and `stage`, the reversible enter/exit crossfade, which eases toward whichever
// state we are in rather than playing to an end.
function IntroController({ immersive }: { immersive: boolean }) {
  useFrame((_, delta) => {
    if (entrance.playing) {
      entrance.p = Math.min(1, entrance.p + delta / ENTRANCE_DURATION);
      if (entrance.p >= 1) entrance.playing = false;
    }
    if (intro.playing) {
      intro.p = Math.min(1, intro.p + delta / INTRO_DURATION);
      if (intro.p >= 1) intro.playing = false;
    }
    advanceStage(immersive ? 1 : 0, Math.min(delta, 0.05));
  });
  return null;
}

// The camera never shifts now -- clear any offset a previous build left on it, so the
// wall and the reel hold still while the mark rides the crossfade up and down.
function StageShift() {
  const { camera } = useThree();
  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera;
    if (cam.view?.enabled) cam.clearViewOffset();
  });
  return null;
}

// Desktop-class only: ShowroomRoute owns the mode decision and mounts this lazily,
// so by the time we are here the mode is settled and is never "static". Taking it as
// a prop rather than reading the hook again is what lets the route keep three.js off
// the wire for the devices that never render this at all.
export function PortfolioShowroom({ mode }: { mode: Exclude<ShowroomMode, "static"> }) {
  const items = SHOWROOM_ITEMS;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [interacted, setInteracted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [wallRevealed, setWallRevealed] = useState(false);
  const [gemAssembled, setGemAssembled] = useState(false);
  const [command, setCommand] = useState<{ index: number; nonce: number }>({ index: 0, nonce: 0 });
  const [closing, setClosing] = useState(false);
  const [motionGate, setMotionGate] = useState(false);
  // The load sequence: the grid dissolves in, THEN the gem shatters together out of
  // its facets, THEN the enter button appears. The gem waits for the wall because it
  // has no texture of its own -- it refracts the wall, so arriving first would show a
  // hollow silhouette. Stable identity: TileWall calls this from a useFrame.
  const onWallRevealed = useCallback(() => {
    setWallRevealed(true);
    if (prefersReducedMotion() || isMotionPaused()) {
      skipEntrance(); // gem simply appears, assembled
      setGemAssembled(true);
      return;
    }
    startEntrance();
    window.setTimeout(() => setGemAssembled(true), ENTRANCE_DURATION * 1000);
  }, []);

  const total = items.length;
  const sel = selected != null ? items[selected] : null;
  const immersive = mode === "webgl" && entered;

  // The immersive chrome has to OUTLIVE the exit. `{immersive && ...}` tore it off the
  // screen the same frame you hit Esc, so nothing it does on the way out is ever seen
  // -- there was no way to animate an exit, only to delete one. Keep it mounted for
  // the length of the rail's slide, marked as exiting, and drop it once it has left.
  const [chromeUp, setChromeUp] = useState(false);
  useEffect(() => {
    if (immersive) {
      setChromeUp(true);
      return;
    }
    if (!chromeUp) return;
    const t = window.setTimeout(() => setChromeUp(false), CHROME_OUT_MS);
    return () => window.clearTimeout(t);
  }, [immersive, chromeUp]);

  // The CTA is the MIRROR of that: it belongs to the exit state, so it has to outlive
  // the ENTRY long enough to leave as the room arrives, and come back as the room
  // goes. It waits for the gem to finish compiling before it ever shows -- inviting a
  // click at a half-assembled gem would cut its own entrance short.
  const [ctaUp, setCtaUp] = useState(false);
  useEffect(() => {
    if (!immersive) {
      if (gemAssembled) setCtaUp(true);
      return;
    }
    if (!ctaUp) return;
    const t = window.setTimeout(() => setCtaUp(false), CHROME_OUT_MS);
    return () => window.clearTimeout(t);
  }, [immersive, ctaUp, gemAssembled]);

  const goTo = (i: number) => setCommand((c) => ({ index: i, nonce: c.nonce + 1 }));

  // Fade the focus modal back out through the gem, then unmount.
  const requestClose = () => {
    if (closing) return;
    if (prefersReducedMotion()) {
      setSelected(null);
      return;
    }
    setClosing(true);
    window.setTimeout(() => {
      setSelected(null);
      setClosing(false);
    }, 520);
  };

  const doEnter = () => {
    setEntered(true);
    setInteracted(true);
    try {
      const played = sessionStorage.getItem("cw-showroom-intro") === "1";
      if (!played && !prefersReducedMotion()) {
        sessionStorage.setItem("cw-showroom-intro", "1");
        startIntro();
      }
    } catch {}
  };

  // The reel is driven by the motion loop; entering with motion paused just freezes
  // it on the gem. If paused, gate entry behind a dialog that turns motion back on.
  const enter = () => {
    if (isMotionPaused()) {
      setMotionGate(true);
      return;
    }
    doEnter();
  };

  const proceedThroughGate = () => {
    setMotionPaused(false);
    setMotionGate(false);
    doEnter();
  };

  // Leaving the showroom always drops any focused project too, so the modal never
  // lingers over the exited state.
  const exitShowroom = () => {
    setSelected(null);
    setClosing(false);
    setEntered(false);
  };

  // Lock the page to the viewport while immersive. No width compensation needed:
  // `scrollbar-gutter: stable` on html (global.css) holds the space globally, and
  // `overflow: hidden` still counts as a scroll container so the gutter survives
  // the lock.
  useEffect(() => {
    if (!immersive) return;
    const el = document.documentElement;
    const prev = el.style.overflow;
    el.style.overflow = "hidden";
    return () => {
      el.style.overflow = prev;
    };
  }, [immersive]);

  // Esc: skip the intro, then close an open project, then exit the showroom.
  useEffect(() => {
    if (mode !== "webgl") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (intro.playing) skipIntro();
      else if (selected != null) requestClose();
      else if (entered) exitShowroom();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, selected, entered, closing]);

  return (
    <div
      className={`${styles.wrap} ${immersive ? styles.locked : ""}`}
      aria-label="chadworks portfolio showroom"
    >
      {/* On the chrome's lifecycle, not on `immersive` -- that unmounts in one frame,
          which is why it had no exit to play. */}
      {chromeUp && (
        <button
          type="button"
          className={`${styles.escBtn} ${immersive ? "" : styles.escBtnOut}`}
          onClick={exitShowroom}
        >
          <span className={styles.escKey}>Esc</span>
          <span className={styles.escLabel}>exit showroom</span>
        </button>
      )}

      {mode === "webgl" && (
        <div className={styles.canvasWrap}>
          <Canvas
            camera={{ position: [0, 0, 6], fov: 38 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            onPointerDown={() => {
              if (immersive) skipIntro();
            }}
          >
            <IntroController immersive={immersive} />
            {/* Lens-shift the entered view up (projection offset, NOT a world
                move) so the gem stays on the optical axis and its orbit reads flat,
                while the gem + reel appear raised to center with the title module. */}
            <StageShift />
            {/* Pre-click: a tiled wall of all the work. Once immersive, the reel
                takes over the same plane. Each gets its OWN Suspense boundary --
                shared, the reel's full-res shots suspended the boundary and blanked
                the wall (veil included) until every reel texture had decoded, so
                the pre-click stage sat empty on first load. */}
            <Suspense fallback={null}>
              <TileWall items={items} onRevealed={onWallRevealed} />
            </Suspense>
            {/* The reel pulls the full-res shots (~5.7MB, and ~20MB of GPU upload
                EACH once decoded) and is invisible until entry, so mounting it up
                front starved the wall's own tiles of bandwidth. Mounting it the
                moment the wall was ready was no better: the decode/upload stall
                then landed right on top of the veil dissolve and froze it. So wait
                for the dissolve to FINISH, and let the reel preload into the quiet
                afterwards -- or mount it straight away if the visitor beats it and
                clicks enter first. */}
            {(wallRevealed || entered) && (
              <Suspense fallback={null}>
                <Reel
                  items={items}
                  active={immersive}
                  command={command}
                  onIndexChange={setIndex}
                  onSelect={setSelected}
                />
              </Suspense>
            )}
            <CrystalGem immersive={immersive} show={wallRevealed} focused={selected != null} />
          </Canvas>

          {/* Entry: click the gem to enter (and trigger the cold open). Held back
              until the gem has finished compiling out of its shards -- inviting a
              click at a half-assembled gem would cut its own entrance short. */}
          {ctaUp && (
            <button
              type="button"
              className={`${styles.enter} ${immersive ? styles.enterOut : ""}`}
              onClick={enter}
            >
              <span className={styles.enterText}>Enter the showroom</span>
            </button>
          )}

          {chromeUp && (
            <>
              {/* Stepped blur over the slide, under the module: the shots carry their
                  own headings and buttons, which read as live chrome right where the
                  module sits. Ramped rather than switched on, so the slide recedes
                  instead of ending at a line. On the gem's clock like the rest. */}
              <div
                className={`${styles.slideBlur} ${immersive ? "" : styles.slideBlurOut}`}
                aria-hidden="true"
              >
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <div
                className={`${styles.stageFrame} ${immersive ? "" : styles.stageFrameOut}`}
                aria-hidden="true"
              />
              <RightRail
                items={items}
                index={index}
                focused={selected != null}
                exiting={!immersive}
                onGo={goTo}
                onOpen={setSelected}
              />

              <div className={`${styles.feature} ${immersive ? "" : styles.featureOut}`}>
                <button
                  type="button"
                  className={styles.featureCard}
                  onClick={() => setSelected(index)}
                  aria-label={`Bring ${items[index]?.label} into focus`}
                >
                  <FitText key={index} className={styles.featureTitle} text={items[index]?.label ?? ""} />
                  <span className={styles.featureMeta}>
                    <span>Platform: {items[index]?.platform ?? "TBD"}</span>
                    <span>Year: {items[index]?.year ?? "TBD"}</span>
                    {/* No "Live:" line for a piece with no public link. */}
                    {items[index]?.href && <span>Live: {items[index]?.url}</span>}
                  </span>
                </button>
                {/* The card gives no sign it is a control until you happen to hover it.
                    Decorative: the card carries its own label for screen readers. */}
                <span className={styles.featureHint} aria-hidden="true">
                  <span className={styles.featureHintText}>Click to open</span>
                  {/* The SFVV-R note-tag arrow, path for path (assets/core/sfvv-r).
                      Aimed by CSS rather than redrawn, so it stays diffable against the
                      original if that arrow ever changes. */}
                  <svg className={styles.featureHintArrow} viewBox="0 0 44 44" fill="none">
                    {/* The tail, cut short at the carrot end. pathLength normalises the
                        curve to 100 whatever its real arc length, so the dash below reads
                        as a percentage: draw the first 80, leave the last 20 empty. The
                        curve runs from the free end toward the carrot, so the fifth that
                        goes missing is the RIGHT one on screen. 80 is the knob; the path
                        itself stays the asset's own. */}
                    <path
                      d="M6 6 C 13 22, 22 30, 34 34"
                      pathLength="100"
                      strokeDasharray="80 100"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* The carrot, nudged down a hair and turned 10deg. Moved by transform
                        rather than by editing d, so the path stays the asset's own. Mind
                        the frame: the svg is turned 290deg as a whole, so screen "down" is
                        NOT +y here. One screen px down is translate(-1.22 0.44) in these
                        units, so this is roughly 2px. The rotate pivots on the carrot's
                        own vertex, so it turns in place; that 290deg is a pure rotation
                        (scale(-1) is both axes, not a mirror), so it preserves handedness
                        and a negative angle reads counter-clockwise on screen too. */}
                    <path
                      d="M23 32 L 34 34 L 30 23"
                      transform="translate(-2.4 0.9) rotate(-10 34 34)"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>

              <div className={styles.hud}>
                <div className={styles.progress}>
                  <span className={styles.progNum}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.progSep}>/</span>
                  <span className={styles.progTot}>{String(total).padStart(2, "0")}</span>
                </div>
                <div className={`${styles.hint} ${interacted ? styles.hintGone : ""}`}>
                  scroll &middot; up / down &middot; click the title to focus
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {mode === "lite" && <LiteGallery items={items} onSelect={setSelected} />}

      {/* The crawlable list that used to sit here is gone: the route now renders the
          real portfolio archive on the server for exactly the cases it covered (no
          JS, pre-decision, phone, tablet), and this component no longer mounts in
          any of them. */}

      {sel && <SelectedFrame item={sel} closing={closing} onClose={requestClose} />}

      {/* Motion gate: the showroom needs live motion, so if the visitor has paused
          it, ask to turn it back on before entering (reuses the motion-invite card). */}
      {motionGate && (
        <div
          className="cw-motion-invite"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cw-showroom-motion-title"
        >
          <div className="cw-motion-invite__card">
            <h2 id="cw-showroom-motion-title" className="cw-motion-invite__title">
              You have paused motion, the showroom requires it
            </h2>
            <p className="cw-motion-invite__body">
              Click the button below to proceed to the showroom.
            </p>
            <div className="cw-motion-invite__actions">
              <button
                type="button"
                className="cw-motion-invite__btn cw-motion-invite__btn--go"
                onClick={proceedThroughGate}
              >
                PROCEED TO THE SHOWROOM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RightRail({
  items,
  index,
  focused,
  exiting,
  onGo,
  onOpen,
}: {
  items: ShowroomItem[];
  index: number;
  focused: boolean;
  exiting: boolean;
  onGo: (i: number) => void;
  onOpen: (i: number) => void;
}) {
  // Normal: click the centered item to open it, any other to slide to it. While a
  // project is focused, a click switches the focus straight to the clicked item
  // (and slides the reel behind so it stays in sync on close).
  const onClick = (i: number) => {
    if (focused) {
      onGo(i);
      onOpen(i);
    } else if (i === index) {
      onOpen(i);
    } else {
      onGo(i);
    }
  };

  // Keep the active thumb pinned at the vertical center: shift the whole rail up
  // one item at a time as the index advances, so earlier items ride off the top.
  //
  // This is also what slides the rail IN. It mounts on the CSS fallback (-50%) and
  // this sets a pixel shift a frame later, so `transition: transform` animates the
  // difference -- the entrance is emergent from that gap, not authored. Which hands
  // us the exit: put --rail-shift back to the fallback and the same transition runs
  // it out, on the same curve, in reverse. That slide is the grounding every other
  // piece of immersive chrome now times against.
  // Because that entrance is emergent, its DURATION is whatever --rail-dur reads at the
  // frame the shift lands. So the retime is a class, not a keyframe: hold the gem's
  // clock over the arrival, then drop it and the fallback takes navigation back.
  const [entering, setEntering] = useState(true);
  useEffect(() => {
    if (!entering) return;
    const t = window.setTimeout(() => setEntering(false), RAIL_IN_MS);
    return () => window.clearTimeout(t);
  }, [entering]);

  const navRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    if (exiting) {
      nav.style.removeProperty("--rail-shift"); // back to -50%: slides out the way it came
      return;
    }
    const setShift = () => {
      const first = nav.querySelector("button");
      if (!first) return;
      const cs = getComputedStyle(nav);
      const gap = parseFloat(cs.rowGap || cs.gap || "0") || 0;
      const h = (first as HTMLElement).offsetHeight;
      const step = h + gap;
      nav.style.setProperty("--rail-shift", `${-(index * step + h / 2)}px`);
    };
    setShift();
    window.addEventListener("resize", setShift);
    return () => window.removeEventListener("resize", setShift);
  }, [index, items.length, exiting]);

  return (
    <>
      {/* Scroll cue: anchored to the viewport center (NOT inside the rail), so it
          stays put while the rail strip slides behind it. */}
      <span
        className={`${styles.railScroll} ${exiting ? styles.railScrollOut : ""}`}
        aria-hidden="true"
      >
        <span className={styles.railScrollArrow}>&#8963;</span>
        <span className={styles.railScrollText}>scroll</span>
        <span className={styles.railScrollArrow}>&#8964;</span>
      </span>
      <nav
        ref={navRef}
        className={`${styles.rail} ${exiting ? styles.railOut : entering ? styles.railIn : ""}`}
        aria-label="Projects"
      >
      {items.map((it, i) => (
        <button
          key={it.key}
          type="button"
          className={`${styles.railItem} ${i === index ? styles.railActive : ""}`}
          aria-current={i === index}
          onClick={() => onClick(i)}
        >
          <span className={styles.railTitle}>{it.label}</span>
          <img src={captureSrc(it.slug)} alt={it.label} loading="lazy" />
          <span className={styles.railBr} aria-hidden="true" />
        </button>
      ))}
      </nav>
    </>
  );
}

function LiteGallery({
  items,
  onSelect,
}: {
  items: ShowroomItem[];
  onSelect: (i: number) => void;
}) {
  return (
    <div className={styles.lite}>
      <div className={styles.liteCrystal} aria-hidden="true" />
      <ul className={styles.liteTrack}>
        {items.map((it, i) => (
          <li key={it.key} className={styles.liteCard}>
            <button type="button" className={styles.liteBtn} onClick={() => onSelect(i)}>
              <img src={captureSrc(it.slug)} alt={it.alt} loading="lazy" />
              <span className={styles.liteLabel}>{it.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SelectedFrame({
  item,
  closing,
  onClose,
}: {
  item: ShowroomItem;
  closing: boolean;
  onClose: () => void;
}) {
  const [hidden, setHidden] = useState(false);
  const invert =
    item.key === "risingcompass" ||
    item.key === "chadlewine" ||
    item.key === "scinet" ||
    item.key === "aes" ||
    item.key === "jeremyhayes";
  return (
    <div
      className={`${styles.selected} ${closing ? styles.selectedClosing : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={item.label}
    >
      <div className={`${styles.frame} ${closing ? styles.frameClosing : ""}`}>
        <span className={styles.frameBr} aria-hidden="true" />
        <img className={styles.shot} src={captureSrc(item.slug)} alt={item.alt} />

        <div
          className={`${styles.meta} ${invert ? styles.metaInvert : ""} ${
            hidden ? styles.metaCollapsed : ""
          }`}
        >
          {/* The panel's own top-right corner is the control -- not a chip sitting on
              it, and not the whole card. The grain is the affordance. */}
          <button
            type="button"
            className={styles.metaCorner}
            aria-expanded={!hidden}
            aria-label={hidden ? `Show ${item.label} details` : `Hide ${item.label} details`}
            onClick={() => setHidden((h) => !h)}
          >
            <span className={styles.metaCornerText}>{hidden ? "Show" : "Hide"}</span>
          </button>
          <FitText as="h2" className={styles.metaTitle} text={item.label} grow active={!hidden} />
          <div className={styles.metaBody}>
            <p className={styles.metaRow}>
              <span>Platform: {item.platform ?? "TBD"}</span>
              <span>Year: {item.year ?? "TBD"}</span>
            </p>
            <ul className={styles.bursts}>
              {item.bursts.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
            {/* Omitted for a piece with no public link (see showroom-data). */}
            {item.href && (
              <a
                className={styles.visit}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                Visit live site <span aria-hidden="true">&#8599;</span>
              </a>
            )}
          </div>
        </div>

        <button type="button" className={`${styles.close} ${invert ? styles.closeInvert : ""}`} onClick={onClose} aria-label="Close">
          &times;
        </button>
      </div>
    </div>
  );
}
