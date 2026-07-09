// PROOF CAPSULE -- concrete examples / portfolio links, no vague claims.
// Columns derive from the item count so rows always fill (rule 8). The heading
// carries svc-fill (the scroll-fill gradient wipe).

import Link from "next/link";
import type { Service } from "@/lib/service";
import { stepColumns } from "@/lib/capsule";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W } from "@/components/capsules/shared";

export type ProofCapsuleProps = {
  proof: NonNullable<Service["proof"]>;
  // "achievements" gives the About page its indexed, gradient-numeral card
  // treatment; the default is the plain proof grid used by service pages.
  variant?: "achievements";
};

export function ProofCapsule({ proof, variant }: ProofCapsuleProps) {
  const isAch = variant === "achievements";
  return (
    <SectionShell className={"svc-block" + (isAch ? " cw-ach" : "")}>
      <h2 className="svc-block__heading svc-fill">{proof.heading}</h2>
      <ul
        className="svc-proof"
        style={
          { "--svc-proof-cols": stepColumns(proof.items.length) } as React.CSSProperties
        }
      >
        {proof.items.map((item, i) => (
          <li key={i} className={"svc-proof__item panel" + (isAch ? " reveal" : "")}>
            {isAch && (
              <span className="cw-ach__index" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
            )}
            <p className="svc-proof__label">
              {!isAch && item.href ? (
                <Link href={item.href} className="svc-proof__link">
                  {item.label}
                </Link>
              ) : (
                item.label
              )}
            </p>
            {item.detail && (
              <p className="svc-proof__detail">
                <W value={item.detail} />
              </p>
            )}
            {isAch && item.href && (
              <a
                className="cw-ach__visit"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit"
              >
                <span aria-hidden="true">&#8599;</span>
              </a>
            )}
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
