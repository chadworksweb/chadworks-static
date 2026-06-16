// Route: /terms-of-service/ -- plain prose legal page (NOT ServiceTemplate).
// Uses the standard page-shell .section wrapper + .measure-prose inner measure.
// NOTE: this legal text is a starting draft for Chad and his counsel to review;
// it is not a substitute for a lawyer's review of the final agreement.

import type { Metadata } from "next";
import { PageMotion } from "@/components/PageMotion";
import { SITE_URL } from "@/lib/service";

const PAGE_URL = `${SITE_URL}/terms-of-service/`;
const TITLE = "Terms of Service | chadworks";
const DESCRIPTION =
  "The terms that govern web design and development work with chadworks: scope and estimates, payment, ownership of your finished site, warranties, and governing law in Pennsylvania.";
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

export default function TermsOfServicePage() {
  return (
    <>
      <PageMotion />
      <section className="section">
        <div className="measure-prose">
          <p className="eyebrow">Legal</p>
          <h1 className="svc-hero__title">
            <span className="text-gradient">Terms of Service</span>
          </h1>
          <p>
            <em>Last updated: {LAST_UPDATED}</em>
          </p>
          <p>
            These Terms of Service govern the web design and development services
            provided by chadworks, a sole-proprietor studio operated by Chad
            Lewine and based in the Greater Philadelphia area of Pennsylvania
            (referred to here as &quot;chadworks,&quot; &quot;I,&quot; or
            &quot;me&quot;). By engaging chadworks for a project, you (the
            &quot;client&quot;) agree to these terms.
          </p>

          <h2>1. Services</h2>
          <p>
            chadworks provides web design, web development, and related digital
            services, which may include visual design, custom code, content
            structure, search and AI visibility work, hosting setup, and ongoing
            maintenance. The specific services for your project are defined in the
            proposal, estimate, or written agreement for that engagement, which
            takes precedence over the general descriptions on this site if the two
            ever differ.
          </p>

          <h2>2. Scope and Estimates</h2>
          <p>
            Each project begins with a defined scope and an estimate. Estimates
            reflect the work described at the time they are given. Work that falls
            outside the agreed scope, including new pages, added features, repeated
            rounds of revision beyond what was quoted, or changes in direction
            after work has begun, may require a revised estimate and additional
            time. I will tell you before doing out-of-scope work so you can decide
            whether to proceed.
          </p>

          <h2>3. Payment</h2>
          <p>
            Work bills against the rates and structure stated in your project
            agreement. Larger projects are typically divided into milestones, with
            payment due as each milestone is delivered. Invoices are due on the
            terms stated on the invoice. If an invoice goes unpaid past its due
            date, I may pause work on the project until the balance is current.
            Final files, accounts, and deliverables are transferred to you once
            the project is paid in full.
          </p>

          <h2>4. Client Responsibilities and Content</h2>
          <p>
            A project moves at the pace of the materials and feedback you provide.
            You agree to supply the content, images, logins, and approvals the
            project needs in a reasonable timeframe. You represent that you own or
            have the right to use any text, images, logos, or other materials you
            give me, and that they do not infringe anyone else&apos;s rights. You
            are responsible for the accuracy of the information you provide,
            including business details, claims, and pricing shown on the site.
          </p>

          <h2>5. Intellectual Property and Ownership</h2>
          <p>
            When your project is paid in full, you own the final website built for
            you: the design as delivered, the custom code, and the content created
            for it. Your domain name and hosting accounts are registered in your
            name and belong to you. I may reuse general techniques, methods, and
            non-client-specific code patterns on other projects, and I retain the
            right to display the finished work in my portfolio and marketing unless
            we agree otherwise in writing. Third-party components, fonts, plugins,
            or libraries used in your site remain subject to their own licenses.
          </p>

          <h2>6. Warranties and Disclaimers</h2>
          <p>
            I build each site with care and stand behind the quality of the work.
            That said, services are provided &quot;as is.&quot; I do not guarantee
            specific business outcomes such as a particular search ranking, a level
            of traffic, placement in an AI assistant&apos;s answers, or a sales
            result, because those depend on factors outside any one
            person&apos;s control. The internet, browsers, hosting platforms, and
            third-party services change over time, and I cannot warrant that a site
            will function identically forever without maintenance.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            To the fullest extent allowed by law, chadworks is not liable for any
            indirect, incidental, or consequential damages arising from the
            services, including lost profits, lost data, or business interruption.
            My total liability for any claim related to a project is limited to the
            amount you paid for that project. Nothing in these terms limits
            liability that cannot be limited under applicable law.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These terms are governed by the laws of the Commonwealth of
            Pennsylvania, without regard to its conflict-of-law rules. Any dispute
            arising from these terms or the services will be handled in the state
            or federal courts located in Pennsylvania.
          </p>

          <h2>9. Changes to These Terms</h2>
          <p>
            I may update these terms from time to time. The version in effect for
            your project is the one referenced in your project agreement, or the
            version posted here on the date your project begins. The
            &quot;last updated&quot; date above reflects the most recent revision.
          </p>

          <h2>10. Contact</h2>
          <p>
            Questions about these terms can go to{" "}
            <a href="mailto:chad@chadworks.co">chad@chadworks.co</a>.
          </p>
        </div>
      </section>
    </>
  );
}
