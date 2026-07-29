// AI DEMO SPLIT -- the second section on /ai-search-visibility/. The ChadGPT
// chat mock on the left, an inverted statement panel on the right. The mock
// shows the mechanism; the panel names the stake, which is why the panel is the
// only inverted thing in the upper half of the page and gets to be loud.
//
// Placed via the `demo` slot (see lib/compose). The statement is a <p>, not a
// heading: it is a claim, not a section title, and promoting it would put a
// second competing headline directly under the H1.

import Link from "next/link";
import { SectionShell } from "@/components/capsules/SectionShell";
import { AiChatDemo } from "@/components/art/AiChatDemo";
import { ScrollHint } from "@/components/ScrollHint";

// The hero's "Learn more" arrow lands here -- the section directly below it.
export const SECTION_ID = "see-it-in-action";

export function AiDemoSplitCapsule() {
  return (
    <SectionShell id={SECTION_ID} className="cw-demosplit-section">
      <div className="cw-demosplit">
        <div className="cw-demosplit__demo">
          <AiChatDemo />
        </div>
        <aside className="cw-demosplit__panel">
          {/* Sits in the page's whitespace above the panel's top-left corner
              and nudges every few seconds, then clears out once it passes 45%
              of the viewport. Decorative: it points at what the page already
              does on its own, so it is hidden from assistive tech rather than
              announced as an instruction. */}
          <ScrollHint className="cw-demosplit__scroll">
            Scroll
            <svg viewBox="0 0 12 14" width="9" height="11" fill="none">
              <path
                d="M6 1v11M1.6 8.2 6 12.6l4.4-4.4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </ScrollHint>
          <p className="cw-demosplit__text">
            <span className="cw-demosplit__line">
              Everyone&apos;s using it.
            </span>
            <span className="cw-demosplit__line cw-demosplit__line--hit">
              Don&apos;t become invisible.
            </span>
          </p>
          <p className="cw-demosplit__fine">
            (I don&apos;t endorse something just because everyone&apos;s using
            it, just read my{" "}
            <Link href="/about/#manifesto">manifesto</Link>, but in this case,
            it is objectively true.)
          </p>
        </aside>
      </div>
    </SectionShell>
  );
}
