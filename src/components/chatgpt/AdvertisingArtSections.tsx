// Advertising-on-ChatGPT work-of-art sections, reproduced faithfully and
// RESKINNED to the global tokens (CWS directive 2026-06-16). Server components:
// the hero (with the decorative AI atmosphere SVG), the why-split that pairs the
// direct answer with the animated ChadGPT chat (the Sponsored-result mechanic),
// the four "how it works" lanes (text-only, no viz), the eligibility grid (new
// bespoke pattern), and the single managed-ads pricing panel. The chat is a
// "use client" island (AdvertisingChat); everything else here is a server
// component. Markup and classes mirror the sibling page so patterns stay shared.

import Link from "next/link";
import { SectionShell } from "@/components/capsules/SectionShell";
import { AdvertisingChat } from "@/components/chatgpt/AdvertisingChat";

export function AdvertisingHero() {
  return (
    <SectionShell full reveal={false} className="cw-art-hero">
      <div className="cw-art-hero__bg" aria-hidden="true" />
      <div className="cw-art-hero__atmos" aria-hidden="true">
        <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="22" y="46" width="196" height="128" rx="26" stroke="currentColor" strokeWidth="6" />
          <path d="M66 174 L66 212 L106 174" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M118 78 C123 102 130 109 154 114 C130 119 123 126 118 150 C113 126 106 119 82 114 C106 109 113 102 118 78 Z" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="cw-art-hero__content">
        <nav className="cw-art-hero__eyebrow cw-art-hero__crumbs" aria-label="Breadcrumb">
          <Link href="/ai-viz/">ChatGPT Ads</Link>
          <span aria-hidden="true">&nbsp;/&nbsp;</span>
          <span aria-current="page">Managed campaigns</span>
        </nav>
        <h1 className="cw-art-hero__h1">
          Advertising on ChatGPT, <em>done for you</em>
        </h1>
        <p className="cw-art-hero__tagline">Show up tomorrow, not next quarter</p>
        <p className="cw-art-hero__sub">
          ChatGPT started running ads at the bottom of its answers in 2026, and the
          platform is now open to businesses of any size. I get you into that space
          and keep you there: I verify your advertiser account, build the campaign,
          write the creative, and run it for a flat $675 a month. You fund the ad
          spend directly to OpenAI, $25 a day minimum. Nothing about it routes
          through me except the work.
        </p>
        <div className="cw-art-hero__actions">
          <Link href="/contact/" className="cw-art-btn cw-art-btn--primary">
            Start managed ChatGPT Ads
          </Link>
          <Link href="#cw-art-how" className="cw-art-btn cw-art-btn--ghost">
            How it works
          </Link>
        </div>
      </div>
    </SectionShell>
  );
}

export function AdvertisingWhyLanes() {
  return (
    <SectionShell className="cw-art-section">
      <div className="cw-art-why__split">
        <div>
          <h2 className="cw-art-section__heading">
            What advertising on ChatGPT actually is.
          </h2>
          <div className="cw-art-direct-answer">
            Advertising on ChatGPT means paying to place your business in the
            sponsored slot at the bottom of a ChatGPT answer, shown to logged-in
            adults on the free and Go tiers. chadworks runs it as a managed service
            for $675 a month. You fund the ad spend separately, $25 a day minimum,
            paid straight to OpenAI.
          </div>
          <p className="cw-art-why__lead">
            The platform is documented in{" "}
            <a
              href="https://help.openai.com/en/articles/20001047-ads-in-chatgpt"
              target="_blank"
              rel="noopener"
            >
              OpenAI&apos;s own help center
            </a>
            . What follows is the plain-English version, and what I do with it.
          </p>
        </div>

        <div className="cw-art-why__right">
          <AdvertisingChat />
        </div>
      </div>

      <h3 className="cw-art-lanes-heading" id="cw-art-how">
        How advertising on ChatGPT works.
      </h3>

      <div className="cw-art-lanes">
        <div className="cw-art-lane cw-art-lane--text">
          <div className="cw-art-lane__num">01</div>
          <div className="cw-art-lane__content">
            <h4 className="cw-art-lane__title">Your ad shows inside the answer, not beside it.</h4>
            <p className="cw-art-lane__desc">
              ChatGPT places ads in a labeled, lightly tinted box at the bottom of
              its reply. There is no sidebar, no banner, no interruption. It reads as
              a suggestion attached to the thing the person was already asking about.
            </p>
            <ul className="cw-art-lane__caps">
              <li>Labeled &ldquo;Sponsored&rdquo; at the bottom of the response</li>
              <li>Shown to free and Go users, never to Plus or Enterprise</li>
              <li>Does not alter the answer the model gives</li>
            </ul>
          </div>
        </div>

        <div className="cw-art-lane cw-art-lane--text">
          <div className="cw-art-lane__num">02</div>
          <div className="cw-art-lane__content">
            <h4 className="cw-art-lane__title">ChatGPT picks the moment, not a keyword.</h4>
            <p className="cw-art-lane__desc">
              There is no keyword auction the way Google works. Placement is matched
              to the topic of the live conversation, the person&apos;s recent chat
              history, and how they have engaged with ads before. The targeting is
              about context, so the creative has to fit the context.
            </p>
            <ul className="cw-art-lane__caps">
              <li>Contextual matching on conversation topic</li>
              <li>Signals from recent chats and past ad interactions</li>
              <li>Creative written to fit the question being asked</li>
            </ul>
          </div>
        </div>

        <div className="cw-art-lane cw-art-lane--text">
          <div className="cw-art-lane__num">03</div>
          <div className="cw-art-lane__content">
            <h4 className="cw-art-lane__title">You buy it through the Ads Manager.</h4>
            <p className="cw-art-lane__desc">
              OpenAI runs a self-serve Ads Manager with cost-per-click and
              cost-per-thousand bidding and no account minimum to get in the door.
              The daily spend floor is $25. I set up the verified advertiser account,
              build the campaign in the Ads Manager, and manage the bids and creative
              from there.
            </p>
            <ul className="cw-art-lane__caps">
              <li>Self-serve Ads Manager, CPC or CPM bidding</li>
              <li>$25 per day spend floor, billed by OpenAI to your card</li>
              <li>Available to advertisers in the US, Canada, Australia, and New Zealand</li>
            </ul>
          </div>
        </div>

        <div className="cw-art-lane cw-art-lane--text">
          <div className="cw-art-lane__num">04</div>
          <div className="cw-art-lane__content">
            <h4 className="cw-art-lane__title">It is genuinely fast to launch.</h4>
            <p className="cw-art-lane__desc">
              Account verification takes a few business days. After that, a new ad
              usually clears review in about 24 hours. That is the real appeal of
              advertising over organic visibility: you can be in front of people
              tomorrow instead of waiting out a content campaign.
            </p>
            <ul className="cw-art-lane__caps">
              <li>Business verification: a few business days, once</li>
              <li>Per-ad approval: about 24 hours</li>
              <li>Live as soon as tomorrow</li>
            </ul>
          </div>
        </div>
      </div>

      <span className="cw-art-last-updated">Last updated 2026-05-30</span>
    </SectionShell>
  );
}

// The eligibility grid: NEW bespoke pattern (.cw-art-eligible). Centered intro,
// two cards (yes / no), a restricted callout, and a cross-linked note.
export function AdvertisingEligibility() {
  return (
    <SectionShell className="cw-art-section cw-art-eligible-section">
      <div className="cw-art-eligible__head">
        <div className="cw-art-section__eyebrow">Before we talk budget</div>
        <h2 className="cw-art-section__heading">
          Can your business advertise on ChatGPT?
        </h2>
        <p className="cw-art-eligible__lead">
          OpenAI allows most consumer and local categories and blocks a specific
          set. I would rather tell you up front than take your money and hit a wall
          at verification.
        </p>
      </div>

      <div className="cw-art-eligible__grid">
        <div className="cw-art-eligible__card cw-art-eligible__card--yes">
          <div className="cw-art-eligible__label">Clear to advertise</div>
          <div className="cw-art-eligible__title">Most consumer and local businesses</div>
          <ul className="cw-art-eligible__list">
            <li>Household and consumer goods</li>
            <li>Local services and trades</li>
            <li>Travel and experiences</li>
            <li>Digital products and education</li>
            <li>Retail, ecommerce, and direct-to-consumer brands</li>
          </ul>
        </div>
        <div className="cw-art-eligible__card cw-art-eligible__card--no">
          <div className="cw-art-eligible__label">Off-limits at launch</div>
          <div className="cw-art-eligible__title">Flat no, any budget</div>
          <ul className="cw-art-eligible__list">
            <li>Dating and adult content</li>
            <li>Alcohol and tobacco</li>
            <li>Gambling</li>
            <li>Cannabis and recreational drugs</li>
            <li>Political content</li>
          </ul>
        </div>
      </div>

      <div className="cw-art-eligible__restricted">
        <strong>Also blocked:</strong> financial services, healthcare and medicine,
        and legal services stay off-limits for paid placement. OpenAI gates these
        regulated categories, so you cannot buy your way into a ChatGPT answer in
        them, whatever your budget.
      </div>

      <p className="cw-art-eligible__note">
        Off-limits, or waiting on a restricted approval? You cannot just buy your
        way into ChatGPT, but you can still earn your way in. That is what the{" "}
        <Link href="/show-up-on-chatgpt/">Show Up on ChatGPT</Link> service is for:
        getting cited in the answer itself instead of the ad box.
      </p>
    </SectionShell>
  );
}

// The single managed-ads pricing panel. Reuses .cw-art-pricing-panel; rendered
// solo (not the duo) with a centered single-column modifier and a handles list.
export function AdvertisingPricing() {
  return (
    <SectionShell className="cw-art-section cw-art-pricing-section">
      <div className="cw-art-section__eyebrow">What it costs</div>
      <h2 className="cw-art-section__heading">
        One flat monthly fee to run, monitor, and optimize your ads.
      </h2>

      <div className="cw-art-pricing-solo">
        <div className="cw-art-pricing-panel cw-art-pricing-panel--ongoing">
          <div className="cw-art-pricing-panel__price">
            $675<span className="cw-art-pricing-panel__per"> / mo</span>
          </div>
          <div className="cw-art-pricing-panel__sub">Managed ChatGPT Ads</div>
          <p className="cw-art-pricing-panel__copy">
            The flat fee covers advertiser-account verification, the campaign build,
            the ad creative, ongoing optimization, and a monthly report you can
            actually read. I run it inside your own Ads Manager so the account stays
            in your name.
          </p>
          <p className="cw-art-pricing-panel__copy">
            <strong>Your ad spend is separate.</strong> It starts at the $25 a day
            minimum and is billed by OpenAI straight to your card. It never passes
            through me, so there is no markup on your media and no question about
            where your money went.
          </p>

          <div className="cw-art-pricing-panel__divider" />
          <div className="cw-art-pricing-panel__sub cw-art-pricing-panel__handles-label">
            What I handle every month
          </div>
          <ul className="cw-art-pricing-panel__handles">
            <li>Advertiser account setup and business verification</li>
            <li>Campaign structure built in the OpenAI Ads Manager</li>
            <li>Ad creative written to match real prompts</li>
            <li>Bid and budget management against what converts</li>
            <li>Landing-page check so the click has somewhere good to land</li>
            <li>A plain monthly report, no dashboard homework for you</li>
          </ul>

          <p className="cw-art-pricing-panel__disclaimer">
            <strong>Heads up:</strong> $675 covers the management. What you spend on
            ads is your call and tracks the results we see. Eligibility depends on
            your category, and we confirm it before launch. Nothing here is a formal
            quote, real numbers come after a quick consult.
          </p>
          <Link
            href="/contact/"
            className="cw-art-btn cw-art-btn--primary cw-art-pricing-panel__cta"
          >
            Start managed ChatGPT Ads
          </Link>
        </div>
      </div>
    </SectionShell>
  );
}
