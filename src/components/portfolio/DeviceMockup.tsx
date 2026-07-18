"use client";

// =====================================================================
// DeviceMockup -- wraps a MockupFrame with a Desktop / Tablet / Mobile toggle
// so a visitor can see each site rendered at each breakpoint (real captures:
// /portfolio/<slug>-<device>.jpg). The frame lives in a fixed-height stage, so
// switching devices swaps the image + bezel without reflowing the grid. The
// frame is sized by height (aspect-ratio per device, set in global.css).
// =====================================================================

import { useState } from "react";
import { MockupFrame } from "./MockupFrame";
import { captureSrc } from "@/lib/captures";

type DeviceKey = "desktop" | "tablet" | "mobile";

const DEVICES: { key: DeviceKey; label: string; variant: "browser" | "tablet" | "phone"; icon: React.ReactNode }[] = [
  {
    key: "desktop",
    label: "Desktop",
    variant: "browser",
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2.5" y="4" width="19" height="13" rx="1.6" />
        <path d="M8.5 21h7M12 17v4" />
      </svg>
    ),
  },
  {
    key: "tablet",
    label: "Tablet",
    variant: "tablet",
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="5" y="2.5" width="14" height="19" rx="2" />
        <path d="M11 18.5h2" />
      </svg>
    ),
  },
  {
    key: "mobile",
    label: "Mobile",
    variant: "phone",
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="7" y="2.5" width="10" height="19" rx="2.2" />
        <path d="M11 18.5h2" />
      </svg>
    ),
  },
];

export function DeviceMockup({
  slug,
  alt,
  url,
  label,
  priority = false,
  size = "card",
}: {
  slug: string;
  alt: string;
  url: string;
  label: string;
  priority?: boolean;
  size?: "card" | "feature";
}) {
  const [device, setDevice] = useState<DeviceKey>("desktop");
  const sel = DEVICES.find((d) => d.key === device)!;

  return (
    <div className={"cw-port-device cw-port-device--" + size} data-device={device}>
      {/* One persistent shell: the frame resizes (data-device drives its width +
          bezel) while MockupFrame crossfades the screenshot inside it. */}
      <div className="cw-port-device__stage">
        <MockupFrame
          src={captureSrc(slug, device)}
          alt={`${alt} -- ${sel.label.toLowerCase()} view`}
          url={url}
          variant={sel.variant}
          priority={priority}
          ripple={device === "desktop"}
        />
      </div>
      <div className="cw-port-device__toggle" role="group" aria-label={`View ${label} on a different device`}>
        {DEVICES.map((d) => (
          <button
            key={d.key}
            type="button"
            className={"cw-port-device__btn" + (d.key === device ? " is-active" : "")}
            aria-pressed={d.key === device}
            onClick={() => setDevice(d.key)}
          >
            <span className="cw-port-device__btn-icon">{d.icon}</span>
            <span className="cw-port-device__btn-label">{d.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
