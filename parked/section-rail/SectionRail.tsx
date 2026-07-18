"use client";

// The site-wide section rail -- expansion plan item I, generalised past the
// homepage it was originally scoped to.
//
// Scope: does NOT replace or restyle the scrollbar. The native bar keeps the
// position job; the rail is wayfinding only.
//
// DISCOVERY IS GENERIC. Every page on the site renders through SectionShell, so
// the rule is simply "a section that owns a heading is a place you can go".
// Nothing is registered, nothing is configured per route, and a page built next
// year gets a working rail the day it ships. Sections without a heading are
// structural rather than navigational and are skipped, which is what closes the
// gap between the ~20 sections a page contains and the ~12 places worth naming.
//
// The one thing discovery cannot do is NAME things well, since an h2 is written
// to be read in place. Short labels live in @/lib/sectionRail; anything with no
// entry falls back to automatic shortening.
//
// Desktop only (>= 900px, in CSS): tablet and mobile never render it.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { prefersReducedMotion } from "@/lib/motion";
import {
  labelFor,
  RAIL_EXCLUDED,
  RAIL_MAX_SECTIONS,
  RAIL_MIN_SECTIONS,
} from "@/lib/sectionRail";
import styles from "./sectionRail.module.css";

type Found = { el: HTMLElement; label: string; id: string };

export function SectionRail() {
  const pathname = usePathname();
  const railRef = useRef<HTMLElement | null>(null);
  const segRefs = useRef<HTMLAnchorElement[]>([]);
  const [found, setFound] = useState<Found[]>([]);
  const [active, setActive] = useState(0);

  const excluded = useMemo(
    () => RAIL_EXCLUDED.some((p) => pathname === p || pathname.startsWith(p + "/")),
    [pathname],
  );

  const scan = useCallback(() => {
    if (excluded) {
      setFound([]);
      return;
    }

    const all = Array.from(
      document.querySelectorAll<HTMLElement>("main section.section"),
    );

    // Sections nest (a full-bleed shell can wrap two more). Keep the innermost:
    // drop any section that contains another candidate.
    const leaves = all.filter((el) => !all.some((o) => o !== el && el.contains(o)));

    const hits: Found[] = [];
    leaves.forEach((el, i) => {
      const heading = el.querySelector<HTMLElement>("h1, h2");
      // the heading must belong to THIS section, not a nested one
      if (!heading || heading.closest("section.section") !== el) return;
      const text = heading.textContent?.trim();
      if (!text) return;

      const label = labelFor(text);
      // consecutive duplicates read as a stutter in the rail
      if (hits.length && hits[hits.length - 1].label === label) return;

      if (!el.id) el.id = `cw-sec-${i}`;
      hits.push({ el, label, id: el.id });
    });

    setFound(hits.slice(0, RAIL_MAX_SECTIONS));
    setActive(0);
  }, [excluded]);

  // Re-scan on every navigation. The retries catch the page transition: the new
  // route's markup is not in the DOM the instant the pathname changes.
  useEffect(() => {
    segRefs.current = [];
    scan();
    const t1 = requestAnimationFrame(scan);
    const t2 = window.setTimeout(scan, 350);
    const t3 = window.setTimeout(scan, 900);
    return () => {
      cancelAnimationFrame(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname, scan]);

  // Segment lengths mirror each section's real share of the document, so the
  // spine shows the shape of the page rather than just its section count.
  useEffect(() => {
    if (found.length === 0) return;

    function measure() {
      const total = document.documentElement.scrollHeight || 1;
      found.forEach((f, i) => {
        const seg = segRefs.current[i];
        if (!seg) return;
        const next = found[i + 1];
        const top = f.el.getBoundingClientRect().top + window.scrollY;
        const bottom = next
          ? next.el.getBoundingClientRect().top + window.scrollY
          : total;
        seg.style.flexGrow = String(Math.max(0.0001, (bottom - top) / total));
        seg.style.flexBasis = "0";
      });
    }

    measure();
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, [found]);

  // Active section via a root collapsed to a 1px band at the viewport's middle:
  // exactly one section can intersect it, so there is no arbitration logic.
  // Scroll math stays as the fallback for sections taller than the viewport.
  useEffect(() => {
    if (found.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (!hit) return;
        const i = found.findIndex((f) => f.el === hit.target);
        if (i >= 0) setActive(i);
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    found.forEach((f) => io.observe(f.el));

    let pending = false;
    const onScroll = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        const mid = window.scrollY + window.innerHeight / 2;
        let idx = 0;
        found.forEach((f, i) => {
          if (f.el.getBoundingClientRect().top + window.scrollY <= mid) idx = i;
        });
        setActive(idx);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [found]);

  // The cursor model: proximity to the right edge reveals the whole label set.
  useEffect(() => {
    if (found.length === 0) return;
    const rail = railRef.current;
    if (!rail) return;
    const onMove = (e: PointerEvent) => {
      rail.classList.toggle(styles.near, window.innerWidth - e.clientX < 120);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [found]);

  // Flip to the light-on-dark palette over dark bands so the spine never
  // disappears into them.
  useEffect(() => {
    if (found.length === 0) return;
    const rail = railRef.current;
    if (!rail) return;

    let pending = false;
    const check = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        const r = rail.getBoundingClientRect();
        const probe = document.elementFromPoint(
          Math.max(2, r.right - 24),
          r.top + r.height / 2,
        );
        const dark = !!probe?.closest(".band-dark, .svc-faq-section--dark");
        rail.classList.toggle(styles.overDark, dark);
      });
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [found]);

  const onClick = (i: number) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    found[i]?.el.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
    history.replaceState(null, "", `#${found[i].id}`);
  };

  const nums = useMemo(
    () => found.map((_, i) => String(i + 1).padStart(2, "0")),
    [found],
  );

  // Short pages have nothing to navigate; a rail there is furniture.
  if (found.length < RAIL_MIN_SECTIONS) return null;

  return (
    <nav
      ref={railRef as React.RefObject<HTMLElement>}
      className={styles.rail}
      aria-label="Page sections"
    >
      <div className={styles.stack}>
        {found.map((f, i) => (
          <a
            key={f.id}
            href={`#${f.id}`}
            ref={(el) => {
              if (el) segRefs.current[i] = el;
            }}
            className={`${styles.seg}${i === active ? ` ${styles.on}` : ""}`}
            aria-current={i === active ? "true" : undefined}
            onClick={onClick(i)}
          >
            <span className={styles.meta}>
              <span className={styles.n}>{nums[i]}</span>
              <span className={styles.t}>{f.label}</span>
            </span>
            <span className={styles.bar} aria-hidden="true" />
          </a>
        ))}
      </div>
    </nav>
  );
}
