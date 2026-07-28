"use client";

// =====================================================================
// WireframeCamera -- the scroll-hijack zoom-and-pan camera.
// The mechanic from the septic niche page, brought into the capsule system and
// styled to the GLOBAL design tokens (CWS directive 2026-06-15: works of art
// become capsules, CSS matches the global site). A tall section pins a framed
// "camera" that scales + pans down a long page mockup, dwelling on each section
// while a synced explainer column describes what that section does. Pills jump.
// Section 0 (a sticky header) is counter-transformed each frame so it stays
// pinned to the top of the camera viewport while the page pans behind it.
//
// Below the tablet-vertical breakpoint the hijack is disabled: the mockup
// renders inline and the explainer becomes a fixed bottom dock.
//
// Per-frame transform writes are imperative (refs + style.transform), not React
// state -- a setState per scroll frame would stutter. Mirrors the proven source.
// =====================================================================

import { useEffect, useRef, type ReactNode } from "react";

export type WfSection = {
  id: number;
  label: string;
  accent: string;
  content: ReactNode;
  sticky?: boolean;
  explain: { label: string; strong: string; body: string };
};

const MOBILE_QUERY = "(max-width: 900px)";

const ZOOM_IN_START = 0.0;
const ZOOM_IN_END = 0.08;
const ZOOM_OUT_START = 0.92;
const ZOOM_OUT_END = 1.0;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export function WireframeCamera({
  sections,
  scrollVh = 540,
  intro,
}: {
  sections: WfSection[];
  scrollVh?: number;
  intro?: { eyebrow?: string; heading: string; lede?: ReactNode };
}) {
  const hijackRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLElement>(null);

  const stickyId = sections.find((s) => s.sticky)?.id ?? sections[0]?.id ?? 0;
  const panIds = sections.filter((s) => s.id !== stickyId).map((s) => s.id);

  useEffect(() => {
    const hijack = hijackRef.current;
    const camera = cameraRef.current;
    const page = pageRef.current;
    if (!hijack || !camera || !page) return;

    const sectionEls = Array.from(
      page.querySelectorAll<HTMLElement>("[data-section-id]"),
    );
    const panEls = sectionEls.filter(
      (el) => Number(el.dataset.sectionId) !== stickyId,
    );
    const panCount = panEls.length;
    if (!panCount) return;

    const explainEls = Array.from(
      hijack.querySelectorAll<HTMLElement>("[data-step]"),
    );
    const pillEls = Array.from(
      hijack.querySelectorAll<HTMLButtonElement>("[data-pill]"),
    );
    const stickyHeader = stickyRef.current;
    const dim = dimRef.current;
    const progressNum = progressRef.current;

    const panSectionId = (i: number) => Number(panEls[i].dataset.sectionId);

    let lastActive = -2;
    function setActiveSection(idx: number) {
      if (idx === lastActive) return;
      lastActive = idx;
      sectionEls.forEach((el) =>
        el.classList.toggle("is-active", Number(el.dataset.sectionId) === idx),
      );
      explainEls.forEach((el) =>
        el.classList.toggle("is-active", Number(el.dataset.step) === idx),
      );
      pillEls.forEach((el) =>
        el.classList.toggle("is-active", Number(el.dataset.pill) === idx),
      );
      if (progressNum) {
        const pos = panIds.indexOf(idx);
        progressNum.textContent = idx < 0 ? "-" : String(pos < 0 ? 1 : pos + 2);
      }
    }

    function getDimOpacity() {
      const rect = hijack!.getBoundingClientRect();
      const vh = window.innerHeight;
      const inT = (vh * 0.8 - rect.top) / (vh * 0.63);
      const outT = (rect.bottom - vh * 0.2) / (vh * 0.63);
      return clamp(Math.min(inT, outT), 0, 1);
    }

    const isMobile = () => window.matchMedia(MOBILE_QUERY).matches;

    let rafId: number | null = null;
    function updateFromScroll() {
      if (isMobile()) return;
      const rect = hijack!.getBoundingClientRect();
      const total = hijack!.offsetHeight - window.innerHeight;
      const scrolled = clamp(-rect.top, 0, total);
      const progress = total > 0 ? scrolled / total : 0;

      const cameraH = camera!.clientHeight || 1;
      const pageH = page!.offsetHeight || 1;
      const fitScale = clamp(cameraH / pageH, 0.05, 1);
      const panMax = Math.max(0, pageH - cameraH);

      let scale: number;
      let translateY: number;
      let sectionIndex: number;
      let zoomedIn: boolean;

      if (progress < ZOOM_IN_END) {
        const t1 = easeInOut(
          (progress - ZOOM_IN_START) / (ZOOM_IN_END - ZOOM_IN_START),
        );
        scale = lerp(fitScale, 1, t1);
        translateY = 0;
        sectionIndex = t1 > 0.4 ? stickyId : -1;
        zoomedIn = t1 > 0.5;
      } else if (progress < ZOOM_OUT_START) {
        const anchorWithin = cameraH / 2;
        const sectionAnchor = (i: number) =>
          panEls[i].offsetTop + panEls[i].offsetHeight / 2;
        const t2 =
          (progress - ZOOM_IN_END) / (ZOOM_OUT_START - ZOOM_IN_END);
        scale = 1;
        const stepFloat = t2 * panCount;
        const idx = Math.min(panCount - 1, Math.floor(stepFloat));
        const nextIdx = Math.min(panCount - 1, idx + 1);
        const localT = stepFloat - idx;

        const DWELL_END = 0.45;
        const fromAnchor = sectionAnchor(idx);
        const toAnchor = sectionAnchor(nextIdx);
        let cameraTargetAnchor: number;
        if (localT <= DWELL_END || idx === nextIdx) {
          cameraTargetAnchor = fromAnchor;
          sectionIndex = panSectionId(idx);
        } else {
          const transT = (localT - DWELL_END) / (1 - DWELL_END);
          const smooth =
            transT * transT * transT * (transT * (transT * 6 - 15) + 10);
          cameraTargetAnchor = fromAnchor + (toAnchor - fromAnchor) * smooth;
          sectionIndex = smooth > 0.5 ? panSectionId(nextIdx) : panSectionId(idx);
        }
        translateY = clamp(-(cameraTargetAnchor - anchorWithin), -panMax, 0);
        zoomedIn = true;
      } else if (progress < ZOOM_OUT_END) {
        const anchorWithin = cameraH / 2;
        const lastAnchor =
          panEls[panCount - 1].offsetTop +
          panEls[panCount - 1].offsetHeight / 2;
        const t3 = easeInOut(
          (progress - ZOOM_OUT_START) / (ZOOM_OUT_END - ZOOM_OUT_START),
        );
        scale = lerp(1, fitScale, t3);
        const startTY = clamp(-(lastAnchor - anchorWithin), -panMax, 0);
        translateY = lerp(startTY, 0, t3);
        sectionIndex = panSectionId(panCount - 1);
        zoomedIn = t3 < 0.5;
      } else {
        scale = fitScale;
        translateY = 0;
        sectionIndex = panSectionId(panCount - 1);
        zoomedIn = false;
      }

      page!.style.transform = `translateY(${translateY.toFixed(2)}px) scale(${scale.toFixed(4)})`;
      camera!.classList.toggle("is-zoomed", zoomedIn);

      if (stickyHeader && scale > 0.001) {
        stickyHeader.style.transform = `translateY(${(-translateY / scale).toFixed(2)}px)`;
      }

      setActiveSection(sectionIndex);
      if (dim) dim.style.opacity = String(getDimOpacity());
    }

    function onScroll() {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        updateFromScroll();
        rafId = null;
      });
    }

    let lastBestId = -2;
    function pickActiveSectionMobile() {
      const anchorY = window.innerHeight * 0.25;
      let bestId = -1;
      let bestDist = Infinity;
      sectionEls.forEach((s) => {
        const rect = s.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const center = (rect.top + rect.bottom) / 2;
        const dist = Math.abs(center - anchorY);
        if (dist < bestDist) {
          bestDist = dist;
          bestId = Number(s.dataset.sectionId);
        }
      });
      if (bestId !== lastBestId && bestId !== -1) {
        lastBestId = bestId;
        setActiveSection(bestId);
      }
    }
    function updateMobileDockVisibility() {
      const dock = dockRef.current;
      if (!dock) return;
      const midY = window.innerHeight * 0.5;
      const rect = hijack!.getBoundingClientRect();
      const visible = rect.top <= midY && rect.bottom >= midY;
      dock.classList.toggle("is-dock-visible", visible);
    }
    let mobileRaf: number | null = null;
    function onScrollMobile() {
      if (!isMobile()) return;
      if (mobileRaf) return;
      mobileRaf = requestAnimationFrame(() => {
        pickActiveSectionMobile();
        updateMobileDockVisibility();
        mobileRaf = null;
      });
    }

    function reset() {
      if (isMobile()) {
        page!.style.transform = "";
        if (stickyHeader) stickyHeader.style.transform = "";
        if (dim) dim.style.opacity = "0";
        pickActiveSectionMobile();
        updateMobileDockVisibility();
      } else {
        const dock = dockRef.current;
        if (dock) dock.classList.remove("is-dock-visible");
        updateFromScroll();
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScrollMobile, { passive: true });
    window.addEventListener("resize", reset, { passive: true });

    const onPill = (e: Event) => {
      const pill = e.currentTarget as HTMLElement;
      const stepIdx = Number(pill.dataset.pill);
      if (isMobile()) {
        const target = sectionEls.find(
          (s) => Number(s.dataset.sectionId) === stepIdx,
        );
        if (target) {
          const top =
            window.scrollY + target.getBoundingClientRect().top - 120;
          window.scrollTo({ top, behavior: "smooth" });
        }
        return;
      }
      const rect = hijack!.getBoundingClientRect();
      const total = hijack!.offsetHeight - window.innerHeight;
      let globalProgress: number;
      if (stepIdx === stickyId) {
        globalProgress = ZOOM_IN_START + 0.7 * (ZOOM_IN_END - ZOOM_IN_START);
      } else {
        const panIdx = panIds.indexOf(stepIdx);
        const panProgress = (panIdx + 0.5) / panCount;
        globalProgress =
          ZOOM_IN_END + panProgress * (ZOOM_OUT_START - ZOOM_IN_END);
      }
      const target = window.scrollY + rect.top + globalProgress * total;
      window.scrollTo({ top: target, behavior: "smooth" });
    };
    pillEls.forEach((p) => p.addEventListener("click", onPill));

    // Skip ahead / go back -- jump past or before the hijack.
    const skipBtn = hijack.querySelector<HTMLButtonElement>("[data-wf-skip]");
    const backBtn = hijack.querySelector<HTMLButtonElement>("[data-wf-back]");
    const onSkip = () => {
      const rect = hijack!.getBoundingClientRect();
      const target =
        window.scrollY + rect.top + hijack!.offsetHeight - window.innerHeight * 0.1;
      window.scrollTo({ top: target, behavior: "smooth" });
    };
    const onBack = () => {
      const rect = hijack!.getBoundingClientRect();
      const target = window.scrollY + rect.top - 120;
      window.scrollTo({ top: target, behavior: "smooth" });
    };
    skipBtn?.addEventListener("click", onSkip);
    backBtn?.addEventListener("click", onBack);

    reset();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScrollMobile);
      window.removeEventListener("resize", reset);
      pillEls.forEach((p) => p.removeEventListener("click", onPill));
      skipBtn?.removeEventListener("click", onSkip);
      backBtn?.removeEventListener("click", onBack);
      if (rafId) cancelAnimationFrame(rafId);
      if (mobileRaf) cancelAnimationFrame(mobileRaf);
    };
  }, [sections, stickyId, panIds]);

  return (
    <div className="cw-wfcam-wrap">
      {intro && (
        <div className="cw-wfcam-intro reveal">
          {intro.eyebrow && <span className="cw-wfcam-intro__eyebrow">{intro.eyebrow}</span>}
          <h2 className="cw-wfcam-intro__heading">{intro.heading}</h2>
          {intro.lede && <p className="cw-wfcam-intro__lede">{intro.lede}</p>}
        </div>
      )}

      <div
        className="cw-wfcam"
        ref={hijackRef}
        style={{ ["--cw-wfcam-vh" as string]: `${scrollVh}vh` }}
        aria-label="Scroll through the sections of a sample page, top to bottom"
      >
        <div className="cw-wfcam__dim" ref={dimRef} aria-hidden="true" />

        <div className="cw-wfcam__sticky">
          <div className="cw-wfcam__stage">
            {/* data-nosnippet on the whole mock page: every section inside
                depicts a FICTIONAL client site (SepticPros, placeholder towns,
                555 numbers). It is illustration, not chadworks copy, and it
                must never be lifted into a search snippet or quoted by an
                assistant as a real business. */}
            <div className="cw-wfcam__viewport" ref={cameraRef} data-nosnippet>
              <div className="cw-wfcam__page" ref={pageRef}>
                {sections.map((s) => (
                  <div
                    key={s.id}
                    ref={s.id === stickyId ? stickyRef : undefined}
                    className={
                      "cw-wfcam__section" +
                      (s.sticky ? " cw-wfcam__section--sticky" : "")
                    }
                    data-section-id={s.id}
                    style={{ ["--block-accent" as string]: s.accent }}
                  >
                    {!s.sticky && (
                      <span className="cw-wfcam__section-label">{s.label}</span>
                    )}
                    {s.content}
                  </div>
                ))}
              </div>
            </div>

            <div className="cw-wfcam__explains" ref={dockRef}>
              <div
                className="cw-wfcam__explain is-active"
                data-step={-1}
                style={{ ["--block-accent" as string]: "var(--accent)" }}
              >
                <div className="cw-wfcam__explain-label">[ Wireframe ]</div>
                <strong>Scroll to explore.</strong>
                <p>
                  The page below is a sample wireframe. As you scroll, the view
                  zooms into each section so you can see what every part does and
                  why it earns its place.
                </p>
              </div>
              {sections.map((s) => (
                <div
                  key={s.id}
                  className="cw-wfcam__explain"
                  data-step={s.id}
                  style={{ ["--block-accent" as string]: s.accent }}
                >
                  <div className="cw-wfcam__explain-label">[ {s.explain.label} ]</div>
                  <strong>{s.explain.strong}</strong>
                  <p>{s.explain.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="cw-wfcam__pills"
            role="tablist"
            aria-label="Wireframe section navigation"
          >
            {sections.map((s, i) => (
              <button
                key={s.id}
                className={"cw-wfcam__pill" + (i === 0 ? " is-active" : "")}
                data-pill={s.id}
                type="button"
                style={{ ["--block-accent" as string]: s.accent }}
                aria-label={`Section ${i + 1} of ${sections.length}: ${s.label}`}
              />
            ))}
            <span className="cw-wfcam__progress">
              <strong ref={progressRef}>1</strong> / {sections.length}
            </span>
            <div className="cw-wfcam__nav">
              <button className="cw-wfcam__skip" data-wf-back type="button">
                &uarr; Go back
              </button>
              <button className="cw-wfcam__skip" data-wf-skip type="button">
                Skip ahead &darr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
