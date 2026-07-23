// Route: /terms-of-service/ -- the SITE terms (permitted use, restrictions,
// disclaimers, venue). NOT a client services agreement: services run on a
// separately executed proposal, and 1.3 states that.
//
// REGISTER: clinical legal. Defined parties ("chadworks" / "the Site" /
// "you"), operative sentences, no first person, no editorial, no reassurance.
// Chad, 2026-07-23: "tone-less, clinical and legal. zero personality, zero
// warmth." Do not soften this copy back toward the site's marketing voice.
// The warranty and liability disclaimers are set in caps on purpose: US courts
// treat conspicuousness as a condition of enforceability for those two.
//
// STRUCTURE: nine h2 parts, each holding h3 clauses. The rail lists the NINE
// only (Chad, 2026-07-23: 23 rail entries was too many). Numbering is derived
// from the array indices -- h2 gets "1.", its clauses get "1.1", "1.2" -- so
// inserting anything renumbers the document. Cross-references in the copy are
// by clause NAME, never by number, so a renumber cannot silently break one.
//
// EVERY CLAUSE IS TIED TO SOMETHING THE SITE ACTUALLY DOES. Audited against
// the codebase 2026-07-23. Interactive Tools covers ScopeCalculator +
// package-builder + Scorecard; Comparative Statements covers the /switch/
// pages; the platform list in 3.3 is the set actually named in src. Cut in
// that pass: force majeure (chadworks owes no performance here), a standalone
// termination-of-access section (no accounts exist to terminate -- the license
// terminates on breach in 2.1 and blocking is reserved there), and the DMCA
// 512(g)/512(f) counter-notification machinery (that regime needs a designated
// agent registered with the Copyright Office, which chadworks has not filed).
//
// NOTE: this is a starting draft for Chad and his counsel to review; it is not
// a substitute for a lawyer's review of the final terms.

import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { PageMotion } from "@/components/PageMotion";
import { LegalToc } from "@/components/LegalToc";
import { SITE_URL } from "@/lib/service";
import { isLaunched } from "@/lib/launch";

const PAGE_PATH = "/terms-of-service/";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const TITLE = "Terms of Service | chadworks";
const DESCRIPTION =
  "Terms of Service governing access to and use of chadworks.co: license and restrictions, automated access and machine learning, intellectual property, published content and interactive tools, submissions, disclaimer of warranties, limitation of liability, and Pennsylvania governing law.";
const EFFECTIVE_DATE = "July 23, 2026";

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

type Clause = { id: string; title: string; body: ReactNode };
type Part = { id: string; title: string; intro?: ReactNode; clauses?: Clause[] };

const PARTS: Part[] = [
  {
    id: "acceptance-and-scope",
    title: "Acceptance and Scope",
    clauses: [
      {
        id: "acceptance",
        title: "Acceptance of Terms",
        body: (
          <>
            <p>
              These Terms of Service (the &quot;Terms&quot;) govern access to and
              use of the website located at chadworks.co (the &quot;Site&quot;).
              The Site is operated by Chad Lewine, a sole proprietor doing
              business as chadworks (&quot;chadworks&quot;).
            </p>
            <p>
              Access to or use of the Site constitutes acceptance of these Terms.
              A person who does not accept these Terms is not authorized to
              access the Site.
            </p>
            <p>
              These Terms incorporate the{" "}
              <Link href="/privacy-policy/">Privacy Policy</Link> by reference.
            </p>
          </>
        ),
      },
      {
        id: "eligibility",
        title: "Eligibility",
        body: (
          <p>
            Access is limited to persons at least 18 years of age and legally
            capable of forming a binding contract. A person accessing the Site on
            behalf of an entity represents that the person holds authority to
            bind that entity to these Terms.
          </p>
        ),
      },
      {
        id: "no-contract-for-services",
        title: "No Contract for Services",
        body: (
          <>
            <p>
              These Terms govern use of the Site. They do not constitute an offer
              to perform services, a proposal, a quotation, or a contract for
              work.
            </p>
            <p>
              Services performed by chadworks are governed exclusively by a
              separate written agreement executed by chadworks and the client
              prior to commencement of work. In the event of a conflict between
              an executed services agreement and these Terms or any other content
              published on the Site, the executed services agreement controls
              with respect to those services.
            </p>
            <p>
              Use of the Site, including submission of any form published on the
              Site, creates no client relationship and imposes no obligation on
              either party.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "use-of-the-site",
    title: "Use of the Site",
    clauses: [
      {
        id: "license",
        title: "License to Access the Site",
        body: (
          <>
            <p>
              chadworks grants a limited, revocable, non-exclusive,
              non-transferable, non-sublicensable license to access and view the
              Site for personal use or internal business evaluation. All rights
              not expressly granted are reserved.
            </p>
            <p>
              The license permits viewing the Site, reproducing individual pages
              for personal reference, and quoting limited portions with
              attribution to chadworks and a link to the source page. The license
              terminates automatically upon breach of these Terms.
            </p>
            <p>
              chadworks reserves the right to restrict or block access to the
              Site by any person, client, agent, or network.
            </p>
          </>
        ),
      },
      {
        id: "restrictions",
        title: "Restrictions on Use",
        body: (
          <>
            <p>The following are prohibited:</p>
            <ul>
              <li>
                reproduction, adaptation, or use of the Site&apos;s design,
                layout, source code, or copy in the development of any other
                website
              </li>
              <li>
                sale, rental, sublicense, distribution, or other commercial
                exploitation of any part of the Site
              </li>
              <li>
                reverse engineering, decompilation, or disassembly of any part of
                the Site
              </li>
              <li>
                scanning, probing, penetration testing, or load testing of the
                Site or its hosting infrastructure
              </li>
              <li>
                circumvention of any access control, rate limit, or security
                measure
              </li>
              <li>
                transmission of malware or any code intended to disrupt, damage,
                or obtain unauthorized access to the Site
              </li>
              <li>
                use of any form or published address on the Site for unsolicited
                commercial messages, bulk messaging, or link solicitation
              </li>
              <li>
                impersonation of any person or entity, or misrepresentation of
                affiliation
              </li>
              <li>
                removal, obscuring, or alteration of any copyright, trademark, or
                attribution notice
              </li>
              <li>
                use of the Site in violation of any applicable law or regulation
              </li>
            </ul>
          </>
        ),
      },
      {
        id: "automated-access",
        title: "Automated Access, Data Collection, and Machine Learning",
        body: (
          <>
            <p>
              Automated indexing and retrieval by search and assistant crawlers
              is permitted subject to the directives published at
              chadworks.co/robots.txt. Quotation of Site content in a generated
              response, with attribution to chadworks and a link to the source
              page, is permitted.
            </p>
            <p>
              The following are prohibited absent prior written authorization
              from chadworks:
            </p>
            <ul>
              <li>
                scraping, harvesting, systematic downloading, or bulk extraction
                of Site content by any automated means
              </li>
              <li>
                incorporation of Site content into any dataset, corpus, index, or
                archive intended for commercial distribution
              </li>
              <li>
                use of Site content to train, fine-tune, evaluate, or otherwise
                develop any machine learning model
              </li>
            </ul>
            <p>
              Compliance with the directives published at chadworks.co/robots.txt
              does not constitute authorization under this clause.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    clauses: [
      {
        id: "ownership",
        title: "Ownership of Site Content",
        body: (
          <p>
            The Site and its contents, including text, essays, source code,
            layout, design, graphics, illustrations, and the compilation and
            arrangement of the foregoing, are the property of chadworks and are
            protected by United States and international copyright law.
          </p>
        ),
      },
      {
        id: "trademarks",
        title: "Trademarks",
        body: (
          <p>
            The chadworks name, the chadworks logo, and the gemstone mark are
            trademarks of chadworks. These Terms transfer no right, title, or
            interest in any of the foregoing.
          </p>
        ),
      },
      {
        id: "third-party-marks",
        title: "Third-Party Marks and Client Work",
        body: (
          <>
            <p>
              The Site displays work performed for clients of chadworks. Client
              names, logos, screenshots, product names, and other marks appearing
              within that work remain the property of their respective owners and
              are displayed for identification purposes. Their display does not
              constitute endorsement of chadworks or of any statement published
              on the Site by the owner of the mark.
            </p>
            <p>
              Platform, product, and company names appearing on the Site,
              including WordPress, Shopify, Squarespace, Wix, GoDaddy, Google
              Workspace, and Mailchimp, are the property of their respective
              owners and are used for identification and descriptive purposes.
              Their use does not imply affiliation with, sponsorship by, or
              endorsement by their owners.
            </p>
            <p>
              A client seeking removal of a project from the Site may submit a
              written request to the address stated in Notices and Contact.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "published-content",
    title: "Content Published on the Site",
    clauses: [
      {
        id: "informational-content",
        title: "Informational Content",
        body: (
          <p>
            Essays, guides, frequently asked questions, comparison pages, and
            similar materials published on the Site are provided for general
            informational purposes. They do not constitute legal, tax,
            accounting, financial, or professional advice. Reliance on them is at
            the reader&apos;s sole risk. Access to such materials creates no
            professional or client relationship.
          </p>
        ),
      },
      {
        id: "comparative-statements",
        title: "Comparative Statements",
        body: (
          <>
            <p>
              The Site publishes statements comparing website platforms, hosting
              providers, content management systems, and service models, and
              identifies third-party products and providers by name. Those
              statements represent the opinion of chadworks, formed from its own
              professional experience and from conditions observed at the time of
              publication.
            </p>
            <p>
              Those statements are not statements of fact concerning any third
              party. Third-party features, pricing, and terms change without
              notice to chadworks. Verification of any comparative statement
              against the current offering of the relevant provider is the
              responsibility of the reader.
            </p>
          </>
        ),
      },
      {
        id: "pricing",
        title: "Pricing Information",
        body: (
          <>
            <p>
              Prices, rate schedules, package descriptions, and figures published
              on the Site are estimates provided for informational purposes. They
              do not constitute an offer, a quotation, or a binding price.
            </p>
            <p>
              Pricing is subject to change without notice. A binding price is
              stated only in a written proposal issued by chadworks. In the event
              of a conflict between a figure published on the Site and a figure
              stated in an executed proposal, the executed proposal controls.
            </p>
          </>
        ),
      },
      {
        id: "interactive-tools",
        title: "Interactive Tools",
        body: (
          <>
            <p>
              The Site publishes interactive tools, including a cost calculator,
              a package configurator, and a visibility scorecard. Output
              generated by those tools is produced from the inputs supplied by
              the user and from general assumptions applied uniformly to all
              users.
            </p>
            <p>
              Tool output does not constitute an offer, a quotation, a
              professional assessment, or an audit of any specific website, and
              it is not a substitute for review of the actual property. chadworks
              makes no representation as to the accuracy or applicability of any
              tool output to any particular circumstance.
            </p>
          </>
        ),
      },
      {
        id: "no-warranty-of-results",
        title: "No Warranty of Results",
        body: (
          <>
            <p>
              chadworks makes no representation or warranty regarding search
              engine rankings, search visibility, inclusion or citation in the
              output of any artificial intelligence system, traffic volume, lead
              volume, conversion rates, or revenue.
            </p>
            <p>
              No statement, figure, example, or project description published on
              the Site constitutes a prediction, projection, or guarantee of
              results.
            </p>
          </>
        ),
      },
      {
        id: "third-party-links",
        title: "Third-Party Links",
        body: (
          <p>
            The Site contains links to third-party websites and services.
            chadworks does not control and is not responsible for the content,
            policies, availability, or practices of any third-party website or
            service. Inclusion of a link does not constitute endorsement. Access
            to a third-party website or service is governed by the terms and
            policies of that party.
          </p>
        ),
      },
    ],
  },
  {
    id: "submissions",
    title: "Submissions",
    clauses: [
      {
        id: "transmission",
        title: "Transmission of Information",
        body: (
          <p>
            Information transmitted through any form published on the Site or by
            email is transmitted at the sender&apos;s risk. Credentials, payment
            card numbers, protected health information, and other information
            subject to statutory protection must not be transmitted through the
            Site.
          </p>
        ),
      },
      {
        id: "no-confidentiality",
        title: "No Confidentiality",
        body: (
          <p>
            Transmission of information to chadworks creates no confidential
            relationship and imposes no obligation of confidentiality absent a
            separately executed nondisclosure agreement.
          </p>
        ),
      },
      {
        id: "accuracy",
        title: "Accuracy and Rights",
        body: (
          <p>
            The sender represents that all submitted information is accurate and
            that the sender holds the rights necessary to submit it.
          </p>
        ),
      },
      {
        id: "feedback",
        title: "Feedback",
        body: (
          <p>
            Ideas, feedback, suggestions, and defect reports submitted regarding
            the Site or the services of chadworks are non-confidential. The
            sender grants chadworks a perpetual, irrevocable, worldwide,
            royalty-free license to use, reproduce, modify, and exploit them
            without restriction and without compensation.
          </p>
        ),
      },
    ],
  },
  {
    id: "disclaimers",
    title: "Disclaimers and Limitation of Liability",
    clauses: [
      {
        id: "availability",
        title: "Modification and Availability of the Site",
        body: (
          <p>
            chadworks reserves the right to modify, suspend, relocate, or
            discontinue the Site or any portion of it at any time, with or
            without notice. chadworks does not warrant continuous or
            uninterrupted availability of the Site and bears no liability for any
            modification, suspension, interruption, or discontinuation.
          </p>
        ),
      },
      {
        id: "warranties",
        title: "Disclaimer of Warranties",
        body: (
          <>
            <p>
              THE SITE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;
              WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. TO THE MAXIMUM
              EXTENT PERMITTED BY APPLICABLE LAW, CHADWORKS DISCLAIMS ALL
              WARRANTIES, INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
            </p>
            <p>
              CHADWORKS DOES NOT WARRANT THAT THE SITE WILL BE UNINTERRUPTED,
              TIMELY, SECURE, OR ERROR FREE, THAT DEFECTS WILL BE CORRECTED, THAT
              THE SITE IS FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS, OR THAT
              ANY CONTENT IS ACCURATE, COMPLETE, OR CURRENT.
            </p>
            <p>
              Certain jurisdictions do not permit the exclusion of certain
              warranties. In those jurisdictions, the foregoing exclusions apply
              to the maximum extent permitted by law.
            </p>
          </>
        ),
      },
      {
        id: "liability",
        title: "Limitation of Liability",
        body: (
          <>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, CHADWORKS SHALL
              NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
              EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS,
              REVENUE, DATA, GOODWILL, OR BUSINESS INTERRUPTION, ARISING OUT OF
              OR RELATING TO ACCESS TO OR USE OF THE SITE, UNDER ANY THEORY OF
              LIABILITY, INCLUDING CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY,
              AND WARRANTY, AND REGARDLESS OF WHETHER CHADWORKS WAS ADVISED OF
              THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p>
              THE AGGREGATE LIABILITY OF CHADWORKS FOR ALL CLAIMS ARISING OUT OF
              OR RELATING TO ACCESS TO OR USE OF THE SITE SHALL NOT EXCEED ONE
              HUNDRED UNITED STATES DOLLARS (US$100).
            </p>
            <p>
              This clause governs access to and use of the Site. Liability
              arising from services performed by chadworks is governed by the
              executed services agreement for those services.
            </p>
            <p>
              Certain jurisdictions do not permit the limitation or exclusion of
              certain damages. In those jurisdictions, the foregoing limitations
              apply to the maximum extent permitted by law.
            </p>
          </>
        ),
      },
      {
        id: "indemnification",
        title: "Indemnification",
        body: (
          <>
            <p>
              You shall indemnify, defend, and hold harmless chadworks and its
              agents from and against all claims, demands, actions, losses,
              liabilities, damages, costs, and expenses, including reasonable
              attorneys&apos; fees, arising out of or relating to your access to
              or use of the Site, your violation of these Terms, or your
              violation of any right of a third party.
            </p>
            <p>
              chadworks shall provide notice of any such claim and may
              participate in its defense with counsel of its own selection.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "claims-and-disputes",
    title: "Claims and Disputes",
    clauses: [
      {
        id: "copyright-claims",
        title: "Copyright Infringement Claims",
        body: (
          <>
            <p>
              Claims of copyright infringement concerning material published on
              the Site must be submitted to{" "}
              <a href="mailto:chad@chadworks.co">chad@chadworks.co</a> and must
              include:
            </p>
            <ul>
              <li>
                identification of the copyrighted work claimed to have been
                infringed
              </li>
              <li>
                identification of the material claimed to be infringing,
                including the URL on the Site at which it appears, in detail
                sufficient to permit location of the material
              </li>
              <li>
                the name, mailing address, telephone number, and email address of
                the complaining party
              </li>
              <li>
                a statement that the complaining party holds a good faith belief
                that the use is not authorized by the copyright owner, its agent,
                or the law
              </li>
              <li>
                a statement, made under penalty of perjury, that the information
                submitted is accurate and that the complaining party is the
                copyright owner or is authorized to act on the owner&apos;s
                behalf
              </li>
              <li>
                the physical or electronic signature of the copyright owner or of
                a person authorized to act on the owner&apos;s behalf
              </li>
            </ul>
            <p>
              Material identified in a conforming claim will be removed or
              disabled pending review.
            </p>
          </>
        ),
      },
      {
        id: "governing-law",
        title: "Governing Law and Venue",
        body: (
          <>
            <p>
              These Terms are governed by the laws of the Commonwealth of
              Pennsylvania, without regard to its conflict of laws provisions.
            </p>
            <p>
              Any action arising out of or relating to these Terms or the Site
              shall be brought exclusively in the state or federal courts located
              in the Commonwealth of Pennsylvania. The parties consent to the
              personal jurisdiction of those courts and waive any objection to
              venue in those courts.
            </p>
          </>
        ),
      },
      {
        id: "dispute-resolution",
        title: "Dispute Resolution",
        body: (
          <>
            <p>
              Prior to commencing any action, the complaining party shall provide
              written notice of the dispute to the other party and shall allow
              thirty (30) days from the date of that notice for resolution.
            </p>
            <p>
              These Terms contain no agreement to arbitrate and no waiver of
              class action rights. This clause does not limit the right of either
              party to bring an action in small claims court.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "general",
    title: "General Provisions",
    clauses: [
      {
        id: "privacy",
        title: "Privacy",
        body: (
          <p>
            Collection and processing of information through the Site, the
            consent mechanism governing analytics, and the procedure for
            withdrawing consent are described in the{" "}
            <Link href="/privacy-policy/">Privacy Policy</Link>, which is
            incorporated into these Terms by reference.
          </p>
        ),
      },
      {
        id: "modification",
        title: "Modification of These Terms",
        body: (
          <p>
            chadworks may revise these Terms at any time. Revisions take effect
            upon posting to the Site. The effective date is stated at the top of
            this page. Continued access to the Site following the posting of a
            revision constitutes acceptance of the revised Terms.
          </p>
        ),
      },
      {
        id: "survival",
        title: "Survival",
        body: (
          <p>
            The following survive termination of the license granted in these
            Terms: Intellectual Property, Submissions, Disclaimers and Limitation
            of Liability, Claims and Disputes, and General Provisions.
          </p>
        ),
      },
      {
        id: "miscellaneous",
        title: "Miscellaneous",
        body: (
          <>
            <p>
              <strong>Severability.</strong> A provision of these Terms held
              invalid or unenforceable shall be modified to the minimum extent
              necessary to render it enforceable, or severed, and the remaining
              provisions shall remain in full force and effect.
            </p>
            <p>
              <strong>No waiver.</strong> Failure to enforce a provision of these
              Terms does not constitute a waiver of that provision or of any
              other provision.
            </p>
            <p>
              <strong>Entire agreement.</strong> These Terms and the Privacy
              Policy constitute the entire agreement between the parties
              regarding use of the Site and supersede all prior communications
              and understandings on that subject.
            </p>
            <p>
              <strong>Assignment.</strong> These Terms may not be assigned or
              transferred by you. chadworks may assign these Terms without
              restriction.
            </p>
            <p>
              <strong>No agency.</strong> These Terms create no partnership,
              joint venture, employment, or agency relationship between the
              parties.
            </p>
            <p>
              <strong>Headings.</strong> Headings are provided for reference and
              do not affect interpretation of these Terms.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "contact",
    title: "Notices and Contact",
    intro: (
      <>
        <p>
          Notices to chadworks under these Terms shall be sent to{" "}
          <a href="mailto:chad@chadworks.co">chad@chadworks.co</a>.
        </p>
        <p>
          chadworks
          <br />
          Chad Lewine, sole proprietor
          <br />
          Greater Philadelphia area, Pennsylvania
        </p>
      </>
    ),
  },
];

// Hoisted so the rail's prop identity is stable across renders (its scroll
// tracking keys off this array). The rail lists the nine PARTS only; clauses
// carry their own ids for deep linking but stay out of the rail.
const RAIL_ITEMS = PARTS.map(({ id, title }) => ({ id, title }));

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
            <em>Effective date: {EFFECTIVE_DATE}</em>
          </p>
          <p>
            These Terms of Service govern access to and use of chadworks.co. They
            state the license granted to users of the Site, the restrictions on
            use and on automated access, the status of the content and tools
            published on the Site, the disclaimers of warranty, the limitation of
            liability, and the governing law. Services performed by chadworks are
            governed by a separately executed written agreement and are not
            addressed by these Terms.
          </p>
        </div>

        <div className="cw-legal">
          <LegalToc sections={RAIL_ITEMS} />

          <div className="cw-legal__body legal-prose">
            {PARTS.map((part, i) => (
              <section key={part.id} id={part.id} className="cw-legal__section">
                <h2>
                  <span className="cw-legal__num">{i + 1}.</span>
                  {part.title}
                </h2>
                {part.intro}
                {part.clauses?.map((c, j) => (
                  <article key={c.id} id={c.id} className="cw-legal__clause">
                    <h3>
                      <span className="cw-legal__num">
                        {i + 1}.{j + 1}
                      </span>
                      {c.title}
                    </h3>
                    {c.body}
                  </article>
                ))}
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
