// RULE CAPSULE -- one governing statement, set large, followed by the prose
// that earns it.
//
// TRACED from the chadlewine Sovereignty Audit page's "The one rule" section
// (GlyphTitle + sa-rule__line + si-prose), rebuilt on CWS tokens.
//
// The shape is the argument: a single line a reader can carry out of the page,
// then the paragraphs that make it mean something. It exists as its own capsule
// because a method's governing rule is not a "problem" and not an "approach" --
// on a page selling extraction, the rule about who authors the output IS the
// product claim, and burying it in a body paragraph loses it.

import type { ReactNode } from "react";
import type { Writable } from "@/lib/service";
import type { Scheme } from "@/lib/capsule";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W } from "@/components/capsules/shared";
import { GlyphTitleBar } from "@/components/capsules/GlyphTitleBar";

export type RuleCapsuleProps = {
  heading: ReactNode;
  // The governing line. Set large; this is the sentence the page is built on.
  line: Writable | ReactNode;
  // The paragraphs that earn it.
  body: (Writable | ReactNode)[];
  id?: string;
  scheme?: Scheme;
  schemeAuto?: boolean;
};

export function RuleCapsule({ heading, line, body, id }: RuleCapsuleProps) {
  return (
    <SectionShell className="svc-block cw-rule" id={id}>
      <GlyphTitleBar>{heading}</GlyphTitleBar>
      <p className="cw-rule__line">
        <W value={line} />
      </p>
      <div className="cw-rule__body measure-prose">
        {body.map((p, i) => (
          <p key={i}>
            <W value={p} />
          </p>
        ))}
      </div>
    </SectionShell>
  );
}
