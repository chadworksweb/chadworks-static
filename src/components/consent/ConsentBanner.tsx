"use client";

import { useState } from "react";
import Link from "next/link";
import type { Consent } from "@/lib/consent";
import "./ConsentBanner.css";

/* The cookie-consent bar. chadworks runs two categories: Essential (always on)
   and Analytics (Google Analytics 4). No advertising or marketing pixels, so
   there is a single optional toggle. ConsentProvider owns persistence. */
export function ConsentBanner({
  initial,
  forceManage,
  onSave,
  onClose,
}: {
  initial: Consent;
  forceManage?: boolean;
  onSave: (c: Consent) => void;
  onClose?: () => void;
}) {
  const [open, setOpen] = useState(!!forceManage);
  const [analytics, setAnalytics] = useState(initial.analytics === 1);
  const [leaving, setLeaving] = useState(false);

  // True when motion should play: the visitor force-enabled it, or the OS does
  // not ask for reduced motion. Used to time the slide-down exit so it still
  // unmounts instantly (no dangling drawer) when motion is off.
  function motionOn(): boolean {
    if (typeof window === "undefined") return false;
    if (document.documentElement.classList.contains("cw-force-motion")) return true;
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // Play the slide-down, then run the real action (persist / close -> unmount).
  const dismiss = (action: () => void) => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(action, motionOn() ? 300 : 0);
  };

  const acceptAll = () => dismiss(() => onSave({ essential: 1, analytics: 1 }));
  const rejectOptional = () => dismiss(() => onSave({ essential: 1, analytics: 0 }));
  const savePrefs = () => dismiss(() => onSave({ essential: 1, analytics: analytics ? 1 : 0 }));

  return (
    <div
      className={`cw-consent${leaving ? " cw-consent--closing" : ""}`}
      role="dialog"
      aria-label="Cookie preferences"
      aria-live="polite"
    >
      <div className="cw-consent__bar">
        <span className="cw-consent__label" aria-hidden="true">
          Cookies
        </span>
        <div className="cw-consent__text">
          This site uses the cookies it needs to work, and with your OK, Google
          Analytics to see how the pages get used.{" "}
          <Link href="/privacy-policy/">Read the privacy policy</Link>.
        </div>
        <div className="cw-consent__actions">
          <button type="button" className="cw-consent__btn cw-consent__btn--primary" onClick={acceptAll}>
            Accept
          </button>
          <button type="button" className="cw-consent__btn cw-consent__btn--ghost" onClick={rejectOptional}>
            Decline
          </button>
          <button
            type="button"
            className="cw-consent__btn cw-consent__btn--ghost"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Manage"}
          </button>
          {onClose && (
            <button
              type="button"
              className="cw-consent__btn cw-consent__btn--ghost"
              aria-label="Dismiss"
              onClick={() => dismiss(onClose)}
            >
              Done
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="cw-consent__details">
          <div className="cw-consent__category">
            <div className="cw-consent__cat-info">
              <div className="cw-consent__cat-name">Essential</div>
              <div className="cw-consent__cat-desc">
                What the site needs to run, plus remembering this cookie choice.
                Always on.
              </div>
            </div>
            <span className="cw-consent__always">Always on</span>
          </div>

          <div className="cw-consent__category">
            <div className="cw-consent__cat-info">
              <div className="cw-consent__cat-name">Analytics</div>
              <div className="cw-consent__cat-desc">
                Google Analytics, so I can see which pages people actually use
                and make the site better.
              </div>
            </div>
            <label className="cw-consent__toggle">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                aria-label="Allow analytics"
              />
              <span className="cw-consent__slider" />
            </label>
          </div>

          <div className="cw-consent__save-row">
            <button type="button" className="cw-consent__btn cw-consent__btn--primary" onClick={savePrefs}>
              Save preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
