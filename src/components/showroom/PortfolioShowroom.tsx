"use client";

// Portfolio showroom shell (Track A). The CW crystal sits at the XY center. On
// load the page is NOT locked: the gem floats as the entry, glowing on hover.
// Clicking it enters the immersive showroom (locks the viewport) and triggers the
// cold open the first time. Inside: the reel slides vertically behind the gem and
// refracts through it; a tap promotes the centered item to the front; a right
// rail navigates. Esc releases the lock back to normal page flow; clicking the
// gem re-enters. Picks WebGL vs a lite gallery; always keeps a crawlable list.

import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Reel } from "./Reel";
import { TileWall } from "./TileWall";
import { CrystalGem } from "./CrystalGem";
import { SHOWROOM_ITEMS, type ShowroomItem } from "./showroom-data";
import { useShowroomMode } from "./useShowroomMode";
import { intro, startIntro, skipIntro, INTRO_DURATION } from "./showroom-intro";
import { prefersReducedMotion, isMotionPaused, setMotionPaused } from "@/lib/motion";
import styles from "./showroom.module.css";

// Shrink a title until it fits its container on one line -- never wraps. Sets a
// `--fit-fs` custom property the CSS uses as the font-size (falling back to the
// CSS clamp when the text already fits). Re-runs on text change and on resize.
function useFitText(dep: string) {
  const ref = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const box = el.parentElement ?? el;
    const fit = () => {
      el.style.setProperty("--fit-fs", ""); // reset to the CSS default, then measure
      const cs = getComputedStyle(box);
      const pad = parseFloat(cs.paddingLeft || "0") + parseFloat(cs.paddingRight || "0");
      const avail = box.clientWidth - pad;
      const natural = el.scrollWidth;
      if (avail > 0 && natural > avail) {
        const base = parseFloat(getComputedStyle(el).fontSize);
        el.style.setProperty("--fit-fs", `${Math.max(10, base * (avail / natural))}px`);
      }
    };
    fit();
    const raf = requestAnimationFrame(fit); // fonts/layout can settle a frame late
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [dep]);
  return ref;
}

function FitText({
  as: Tag = "span",
  className,
  text,
}: {
  as?: "span" | "h2";
  className?: string;
  text: string;
}) {
  const ref = useFitText(text);
  return (
    <Tag ref={ref as React.Ref<HTMLHeadingElement & HTMLSpanElement>} className={className}>
      {text}
    </Tag>
  );
}

// Entered-state upward shift as a FRACTION of viewport height, applied as a camera
// lens-shift (projection offset) -- not a world move -- so the gem stays on the
// optical axis and its orbit stays flat, while the gem + reel appear raised to
// center with the title module. Tune alongside .feature `bottom` in the CSS.
const STAGE_SHIFT_FRAC = 0.1;

function IntroController() {
  useFrame((_, delta) => {
    if (!intro.playing) return;
    intro.p = Math.min(1, intro.p + delta / INTRO_DURATION);
    if (intro.p >= 1) intro.playing = false;
  });
  return null;
}

// Lens-shift the camera up while immersive so the entered composition sits higher
// on screen without moving any object off the optical axis (which would perspective-
// distort the gem's orbit). setViewOffset shifts the projection uniformly; the gem's
// FBO refraction reads the same shifted projection, so it stays consistent.
function StageShift({ immersive }: { immersive: boolean }) {
  const { camera, size } = useThree();
  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera;
    if (immersive) {
      const dy = Math.round(size.height * STAGE_SHIFT_FRAC);
      cam.setViewOffset(size.width, size.height, 0, dy, size.width, size.height);
    } else if (cam.view?.enabled) {
      cam.clearViewOffset();
    }
  });
  return null;
}

export function PortfolioShowroom() {
  const items = SHOWROOM_ITEMS;
  const { mode } = useShowroomMode();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [interacted, setInteracted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [command, setCommand] = useState<{ index: number; nonce: number }>({ index: 0, nonce: 0 });
  const [closing, setClosing] = useState(false);
  const [motionGate, setMotionGate] = useState(false);

  const total = items.length;
  const sel = selected != null ? items[selected] : null;
  const immersive = mode === "webgl" && entered;

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

  // Lock the page to the viewport while immersive.
  useEffect(() => {
    if (!immersive) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
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
      {immersive && (
        <button type="button" className={styles.escBtn} onClick={exitShowroom}>
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
            <IntroController />
            {/* Lens-shift the entered view up (projection offset, NOT a world
                move) so the gem stays on the optical axis and its orbit reads flat,
                while the gem + reel appear raised to center with the title module. */}
            <StageShift immersive={immersive} />
            <Suspense fallback={null}>
              {/* Pre-click: a tiled wall of all the work. Once immersive, the reel
                  takes over the same plane. */}
              <TileWall items={items} visible={!immersive} />
              <Reel
                items={items}
                active={immersive}
                command={command}
                onIndexChange={setIndex}
                onSelect={setSelected}
              />
            </Suspense>
            <CrystalGem immersive={immersive} />
          </Canvas>

          {/* Entry: click the gem to enter (and trigger the cold open). */}
          {!entered && (
            <button type="button" className={styles.enter} onClick={enter}>
              <span className={styles.enterText}>Enter the showroom</span>
            </button>
          )}

          {immersive && (
            <>
              <div className={styles.stageFrame} aria-hidden="true" />
              <RightRail
                items={items}
                index={index}
                focused={selected != null}
                onGo={goTo}
                onOpen={setSelected}
              />

              <div className={styles.feature}>
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
                    <span>Live: {items[index]?.url}</span>
                  </span>
                </button>
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

      {/* Crawlable fallback: shown pre-hydration and with no JS. */}
      <ul className={styles.seo} data-shown={mode === null}>
        {items.map((it) => (
          <li key={it.key}>
            <a href={it.href}>{it.label}</a> - {it.blurb}
          </li>
        ))}
      </ul>

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
  onGo,
  onOpen,
}: {
  items: ShowroomItem[];
  index: number;
  focused: boolean;
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
  const navRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
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
  }, [index, items.length]);

  return (
    <>
      {/* Scroll cue: anchored to the viewport center (NOT inside the rail), so it
          stays put while the rail strip slides behind it. */}
      <span className={styles.railScroll} aria-hidden="true">
        <span className={styles.railScrollArrow}>&#8963;</span>
        <span className={styles.railScrollText}>scroll</span>
        <span className={styles.railScrollArrow}>&#8964;</span>
      </span>
      <nav ref={navRef} className={styles.rail} aria-label="Projects">
      {items.map((it, i) => (
        <button
          key={it.key}
          type="button"
          className={`${styles.railItem} ${i === index ? styles.railActive : ""}`}
          aria-current={i === index}
          onClick={() => onClick(i)}
        >
          <span className={styles.railTitle}>{it.label}</span>
          <img src={`/portfolio/${it.slug}-desktop.jpg`} alt={it.label} loading="lazy" />
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
              <img src={`/portfolio/${it.slug}-desktop.jpg`} alt={it.alt} loading="lazy" />
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
        <img className={styles.shot} src={`/portfolio/${item.slug}-desktop.jpg`} alt={item.alt} />

        <div
          className={`${styles.meta} ${invert ? styles.metaInvert : ""} ${
            hidden ? styles.metaCollapsed : ""
          }`}
          role="button"
          tabIndex={0}
          aria-expanded={!hidden}
          aria-label={hidden ? `Show ${item.label} details` : `Hide ${item.label} details`}
          onClick={() => setHidden((h) => !h)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setHidden((h) => !h);
            }
          }}
        >
          <span className={styles.metaHide} aria-hidden="true">
            {hidden ? "Show ▲" : "Hide ▼"}
          </span>
          <p className={styles.metaKick}>{item.url}</p>
          <FitText as="h2" className={styles.metaTitle} text={item.label} />
          <div className={styles.metaBody}>
            <p className={styles.metaRow}>
              <span>Platform: {item.platform ?? "TBD"}</span>
              <span>Year: {item.year ?? "TBD"}</span>
              <span>By: chadworks</span>
            </p>
            <ul className={styles.bursts}>
              {item.bursts.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
            <a
              className={styles.visit}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              Visit live site <span aria-hidden="true">&#8599;</span>
            </a>
          </div>
        </div>

        <button type="button" className={`${styles.close} ${invert ? styles.closeInvert : ""}`} onClick={onClose} aria-label="Close">
          &times;
        </button>
      </div>
    </div>
  );
}
