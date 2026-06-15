// TESTIMONIALS CAPSULE (optional) -- social proof: real client voice.

import type { Service } from "@/lib/service";
import { SectionShell } from "@/components/capsules/SectionShell";
import { W } from "@/components/capsules/shared";

export type TestimonialsCapsuleProps = {
  testimonials: NonNullable<Service["testimonials"]>;
};

export function TestimonialsCapsule({ testimonials }: TestimonialsCapsuleProps) {
  return (
    <SectionShell full className="svc-testimonials-band">
      <h2 className="svc-block__heading">{testimonials.heading}</h2>
      <ul className="svc-testimonials">
        {testimonials.items.map((t, i) => (
          <li key={i} className="svc-testimonial panel">
            <blockquote className="svc-testimonial__quote">
              <W value={t.quote} />
            </blockquote>
            <p className="svc-testimonial__by">
              <W value={t.attribution} />
            </p>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
