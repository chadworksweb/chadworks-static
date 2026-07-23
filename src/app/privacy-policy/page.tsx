// Route: /privacy-policy/ -- plain prose legal page (NOT ServiceTemplate).
// Uses the standard page-shell .section wrapper + .measure-prose inner measure.
// This policy mirrors actual practice per the LEIT Tracking and Consent
// Standard: chadworks runs Google Analytics 4 (consent-gated), no ad pixels,
// no session replay. NOTE: it is a starting draft for Chad and his counsel to
// review; it is not a substitute for a lawyer's review of the final policy.

import type { Metadata } from "next";
import { PageMotion } from "@/components/PageMotion";
import { SITE_URL } from "@/lib/service";
import { isLaunched } from "@/lib/launch";

const PAGE_PATH = "/privacy-policy/";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const TITLE = "Privacy Policy | chadworks";
const DESCRIPTION =
  "How chadworks handles your information: what the contact form collects, how consent controls Google Analytics, the limited service providers involved, your California privacy rights, and how to request your data. chadworks does not sell or share your information.";
const LAST_UPDATED = "July 6, 2026";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: isLaunched(PAGE_PATH), follow: true },
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
        <div className="measure-prose legal-prose">
          <p className="eyebrow">Legal</p>
          <h1 className="svc-hero__title">
            <span className="text-gradient">Privacy Policy</span>
          </h1>
          <p>
            <em>Last updated: {LAST_UPDATED}</em>
          </p>
          <p>
            chadworks is a sole-proprietor web design and development studio
            operated by Chad Lewine and based in the Greater Philadelphia area of
            Pennsylvania. This policy explains what this site collects, how your
            consent controls analytics, and the choices you have. I keep data
            collection minimal on purpose.
          </p>

          <h2>1. What This Site Collects</h2>
          <p>
            When you submit the contact form, I collect the information you
            choose to enter. That usually means your name, email address, phone
            number when you provide it, your business name, and the message or
            project details you write.
          </p>
          <p>
            With your consent, this site also runs Google Analytics 4 to measure
            how the site is used, such as which pages are viewed and the general
            type of device or browser. Analytics data is not used to personally
            identify you. If you do not consent, Google Analytics does not load
            and sends nothing.
          </p>

          <h2>2. Your Consent Controls Analytics</h2>
          <p>
            Google Analytics only runs after you allow it, and how the default is
            set depends on where you are:
          </p>
          <ul>
            <li>
              In the EU, the EEA, the UK, Switzerland, and California, analytics
              stay off until you click Accept. Nothing is sent to Google before
              that.
            </li>
            <li>
              Everywhere else, analytics may load by default, and you can decline
              at any time from the cookie banner or the footer.
            </li>
          </ul>
          <p>
            You can change or withdraw your choice whenever you like using the
            "Cookie preferences" link in the footer. If your browser sends a
            Global Privacy Control or Do Not Track signal, I treat that as a
            decline and analytics stay off no matter what a saved choice says.
          </p>

          <h2>3. Google Analytics</h2>
          <p>
            Google Analytics is provided by Google. When it is allowed to run, it
            sets first-party cookies (named <code>_ga</code> and{" "}
            <code>_ga_*</code>) that last up to two years and help it count
            returning visits. The usage data it gathers is processed by Google
            under its own terms. This site does not run any advertising or
            cross-site pixels, and it does not record your screen or your typing.
          </p>

          <h2>4. Cookies This Site Uses</h2>
          <p>Two kinds, and nothing more:</p>
          <ul>
            <li>
              <strong>Essential.</strong> <code>cw_cookie_consent</code> remembers
              your cookie choice, and <code>cw_geo_default</code> remembers the
              regional default so the banner does not have to ask twice. Both last
              one year. These are always on because the consent tool needs them.
            </li>
            <li>
              <strong>Analytics.</strong> The Google Analytics <code>_ga</code>{" "}
              and <code>_ga_*</code> cookies above. These are set only after you
              allow analytics.
            </li>
          </ul>
          <p>
            Most browsers let you block or delete cookies in their settings if you
            prefer, and the site still works without them.
          </p>

          <h2>5. How I Use Your Information</h2>
          <p>
            I use what you submit through the form to respond to your inquiry,
            prepare an estimate or proposal, and communicate with you about your
            project. Analytics data is used only to understand how the site
            performs and where it can be improved. I do not use your information
            for unrelated marketing without your consent.
          </p>

          <h2>6. I Do Not Sell or Share Your Data</h2>
          <p>
            chadworks does not sell, rent, trade, or share your personal
            information for advertising. If you are a California resident, the
            CCPA and CPRA give you the right to know what personal information is
            held about you, to have it deleted, to have it corrected, and to opt
            out of any sale or sharing. I do not sell or share it in the first
            place, and I honor Global Privacy Control as an opt-out signal. To
            exercise any of these rights, email me at the address below.
          </p>

          <h2>7. Service Providers</h2>
          <p>
            Running this site and responding to you involves a small number of
            trusted providers. The site itself is hosted on a Libra Engine server.
            Google Analytics measures usage when you allow it. A Libra Engine (LEIT)
            service delivers your form submission to my inbox and provides the
            regional lookup that sets your analytics default, and an email provider
            (Resend) routes the message. Each provider processes data only to
            perform its service. I do not share your information with anyone else
            except where the law requires it.
          </p>

          <h2>8. IP Addresses</h2>
          <p>
            Your IP address is used in two limited ways: to look up your general
            region so the analytics default is set correctly, and to protect the
            contact form against spam and abuse. I do not use it to build a
            profile of you or to identify you across other sites.
          </p>

          <h2>9. Data Requests and Retention</h2>
          <p>
            You can ask me what information I hold about you, ask for a correction,
            or ask me to delete it. I keep contact-form submissions and project
            communications for as long as needed to do the work and meet ordinary
            business and record-keeping obligations, then remove what is no longer
            needed. To make a request, email me at the address below.
          </p>

          <h2>10. Contact</h2>
          <p>
            Questions about this policy, or a request about your data, can go to{" "}
            <a href="mailto:chad@chadworks.co">chad@chadworks.co</a>.
          </p>
        </div>
      </section>
    </>
  );
}
