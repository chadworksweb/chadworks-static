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

export function AiDemoSplitCapsule() {
  return (
    <SectionShell className="cw-demosplit-section">
      <div className="cw-demosplit">
        <div className="cw-demosplit__demo">
          <AiChatDemo />
        </div>
        <aside className="cw-demosplit__panel">
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
