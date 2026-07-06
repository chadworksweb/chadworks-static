// Route: /privacy-policy/ -- plain prose legal page (NOT ServiceTemplate).
// Uses the standard page-shell .section wrapper + .measure-prose inner measure.
// NOTE: this privacy text is a starting draft for Chad and his counsel to
// review; it is not a substitute for a lawyer's review of the final policy.

import type { Metadata } from "next";
import { PageMotion } from "@/components/PageMotion";
import { SITE_URL } from "@/lib/service";

const PAGE_URL = `${SITE_URL}/privacy-policy/`;
const TITLE = "Privacy Policy | chadworks";
const DESCRIPTION =
  "How chadworks handles your information: what the contact form collects, how it is used to respond to you, the limited third parties involved, and how to request your data. chadworks does not sell your information.";
const LAST_UPDATED = "June 16, 2026";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "chadworks" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-default.png"],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageMotion />
      <section className="section">
        <div className="measure-prose">
          <p className="eyebrow">Legal</p>
          <h1 className="svc-hero__title">
            <span className="text-gradient">Privacy Policy</span>
          </h1>
          <p>
            <em>Last updated: {LAST_UPDATED}</em>
          </p>
          <p>
            chadworks is a sole-proprietor web design and development studio
            operated by Chad and based in the Greater Philadelphia area of
            Pennsylvania. This policy explains what information this site collects,
            how it is used, and the choices you have. I keep data collection
            minimal on purpose.
          </p>

          <h2>1. What I Collect</h2>
          <p>
            When you submit the contact form, I collect the information you choose
            to enter, which typically includes your name, email address, phone
            number (when you provide it), your business name, and the message or
            project details you write. I also collect basic, aggregated analytics
            about how this site is used, such as which pages are visited and the
            general type of device or browser. Analytics data is not used to
            personally identify you.
          </p>

          <h2>2. How I Use It</h2>
          <p>
            I use the information you submit to respond to your inquiry, to prepare
            an estimate or proposal, and to communicate with you about your
            project. Analytics data is used only to understand how the site
            performs and where it can be improved. I do not use your information
            for unrelated marketing without your consent.
          </p>

          <h2>3. I Do Not Sell Your Data</h2>
          <p>
            chadworks does not sell, rent, or trade your personal information to
            anyone. The information you provide is used to work with you, and for
            nothing else.
          </p>

          <h2>4. Third Parties</h2>
          <p>
            Running this site and responding to you involves a small number of
            trusted service providers, which may include a hosting provider that
            serves the site, an analytics provider that measures usage, and an
            email delivery provider that routes your form submission to my inbox.
            These providers process data only to perform their service and are
            subject to their own privacy practices. I do not share your information
            with any other parties except where required by law.
          </p>

          <h2>5. Cookies and Tracking</h2>
          <p>
            This site uses only the cookies and similar technologies needed for
            basic functionality and aggregate analytics. It does not run
            advertising trackers. Most browsers let you block or delete cookies in
            their settings if you prefer; the site will still work without them.
          </p>

          <h2>6. Data Requests and Retention</h2>
          <p>
            You can ask me what information I hold about you, ask for a correction,
            or ask me to delete it. I keep contact-form submissions and project
            communications for as long as needed to do the work and meet ordinary
            business and record-keeping obligations, then remove what is no longer
            needed. To make a request, email me at the address below.
          </p>

          <h2>7. Contact</h2>
          <p>
            Questions about this policy, or a request about your data, can go to{" "}
            <a href="mailto:chad@chadworks.co">chad@chadworks.co</a>.
          </p>
        </div>
      </section>
    </>
  );
}
