// AGENCY THREAD -- the Brixhollow email exchange, as embedded in the essay
// /essays/is-your-agency-ripping-you-off/ via the {{voicebox}} token.
//
// A ONE-OFF: ported from <SepticVoicebox /> (the service-page "industry_voice"
// block) and deliberately forked rather than shared, because this is the only
// essay that will carry a thread like it. The two can now drift apart safely.
//
// What changed in the port:
//   - the eyebrow + H2 are GONE. On the service pages they introduce the beat;
//     inside this essay they restated the H1 ("Is Your Agency Ripping You
//     Off?") word for word, 1,100 words after the reader already read it.
//   - the wrapper is `essay-thread`, its own shade band at site width (the
//     essay's prose runs at reading measure; this breaks out wider).
// The thread markup itself reuses the global .cw-art-thread__* styles rather
// than duplicating ~300 lines of CSS. All 16 messages, every word verbatim
// (real exchange, names changed).
import { SepticVoiceboxThread } from "@/components/septic/SepticVoicebox";

export function AgencyThreadEmbed() {
  return (
    <div className="essay-thread">
      <div className="essay-thread__layout">
        <div className="essay-thread__main">
          <SepticVoiceboxThread />
        </div>
        <div className="essay-thread__aside-img" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/people/chad-cutout-home.webp"
            alt=""
            loading="lazy"
            decoding="async"
            width={600}
            height={1436}
          />
        </div>
      </div>
    </div>
  );
}
