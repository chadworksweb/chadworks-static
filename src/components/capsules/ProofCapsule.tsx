// PROOF CAPSULE -- concrete examples / portfolio links, no vague claims.
// Columns derive from the item count so rows always fill (rule 8). The heading
// carries svc-fill (the scroll-fill gradient wipe).

import Link from "next/link";
import type { Service } from "@/lib/service";
import { stepColumns } from "@/lib/capsule";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W } from "@/components/capsules/shared";

export type ProofCapsuleProps = { proof: NonNullable<Service["proof"]> };

export function ProofCapsule({ proof }: ProofCapsuleProps) {
  return (
    <SectionShell className="svc-block">
      <h2 className="svc-block__heading svc-fill">{proof.heading}</h2>
      <ul
        className="svc-proof"
        style={
          { "--svc-proof-cols": stepColumns(proof.items.length) } as React.CSSProperties
        }
      >
        {proof.items.map((item, i) => (
          <li key={i} className="svc-proof__item panel">
            <p className="svc-proof__label">
              {item.href ? (
                <Link href={item.href} className="svc-proof__link">
                  {item.label}
                </Link>
              ) : (
                item.label
              )}
            </p>
            <p className="svc-proof__detail">
              <W value={item.detail} />
            </p>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
