// Show-Up-on-ChatGPT work-of-art sections, reproduced faithfully and RESKINNED
// to the global tokens (CWS directive 2026-06-15). Server components: the hero
// (with the decorative AI atmosphere SVG), the why-split that pairs the direct
// answer with the animated ChadGPT chat, and the four "why you're invisible"
// lanes (text-only, no viz). The chat itself is a "use client" island
// (ChatgptVisibility); everything else here is a server component. Markup and
// classes mirror the septic reproduction so the patterns stay shared.

import Link from "next/link";
import { SectionShell } from "@/components/capsules/SectionShell";
import { AI_VIZ_MONTHLY, AUDIT } from "@/lib/pricing";
import { money } from "@/lib/package-builder";
import { ChatgptVisibility } from "@/components/chatgpt/ChatgptVisibility";

export function ChatgptHero() {
  return (
    <SectionShell full reveal={false} className="cw-art-hero">
      <div className="cw-art-hero__bg" aria-hidden="true" />
      <div className="cw-art-hero__atmos" aria-hidden="true">
        <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="48" width="170" height="116" rx="24" stroke="currentColor" strokeWidth="6" />
          <path d="M58 164 L58 200 L96 164" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M104 80 C109 102 115 108 137 112 C115 116 109 122 104 144 C99 122 93 116 71 112 C93 108 99 102 104 80 Z" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
          <path d="M176 66 A44 44 0 0 1 210 108" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          <path d="M188 50 A66 66 0 0 1 226 120" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="cw-art-hero__content">
        <nav className="cw-art-hero__eyebrow cw-art-hero__crumbs" aria-label="Breadcrumb">
          <Link href="/ai-search-visibility/">AI Search Visibility</Link>
          <span aria-hidden="true">&nbsp;/&nbsp;</span>
          <span aria-current="page">GEO</span>
        </nav>
        <h1 className="cw-art-hero__h1">
          Show up on ChatGPT <em>and every AI that answers for you</em>
        </h1>
        <p className="cw-art-hero__tagline">Your site may literally be invisible to AI crawlers</p>
        <p className="cw-art-hero__sub">
          When a customer asks ChatGPT, Claude, Gemini, or Perplexity for
          &ldquo;the best [what you do] near me,&rdquo; one of two things happens:
          your business gets named, or someone else does. A lot of sites never get
          named because the AI crawlers cannot even read them. I find out why, fix
          it, and build the content that earns the citation, so you show up on
          ChatGPT instead of your competitor. It starts with a {money(AUDIT)} audit.
        </p>
        <div className="cw-art-hero__actions">
          <Link href="/contact/" className="cw-art-btn cw-art-btn--primary">
            Get visible for {money(AUDIT)}
          </Link>
          <Link href="#cw-art-score" className="cw-art-btn cw-art-btn--ghost">
            Am I invisible?
          </Link>
        </div>
      </div>
    </SectionShell>
  );
}

export function ChatgptWhyLanes() {
  return (
    <SectionShell className="cw-art-section">
      <div className="cw-art-why__split">
        <div>
          <h2 className="cw-art-section__heading">
            What it takes to show up on ChatGPT.
          </h2>
          <div className="cw-art-direct-answer">
            To show up on ChatGPT you have to be readable and quotable to AI
            crawlers. That means letting bots like GPTBot and OAI-SearchBot in,
            adding structured data that names your business, and writing content
            that answers real questions. Most sites fail at least one of these, so
            they stay invisible. A {money(AUDIT)} audit tells you which ones are costing you.
          </div>
          <p className="cw-art-why__lead">
            This is the organic side of AI search, sometimes called GEO, and it is
            how you show up on ChatGPT without paying for the slot. If you need to
            be visible tomorrow instead, see{" "}
            <Link href="/advertising-on-chatgpt/">advertising on ChatGPT</Link>.
          </p>
        </div>

        <div className="cw-art-why__right">
          <ChatgptVisibility />
        </div>
      </div>

      <h3 className="cw-art-lanes-heading" id="cw-art-how">
        Why your site is invisible to AI crawlers.
      </h3>

      <div className="cw-art-lanes">
        <div className="cw-art-lane cw-art-lane--text">
          <div className="cw-art-lane__num">01</div>
          <div className="cw-art-lane__content">
            <h4 className="cw-art-lane__title">The crawlers are blocked at the door.</h4>
            <p className="cw-art-lane__desc">
              Plenty of sites quietly block the exact bots that feed AI answers,
              usually by accident in a robots.txt copied from somewhere else. If
              GPTBot, OAI-SearchBot, ClaudeBot, and PerplexityBot cannot fetch your
              pages, you are not in the running.
            </p>
            <ul className="cw-art-lane__caps">
              <li>robots.txt blocking AI user-agents</li>
              <li>Google-Extended disallowed</li>
              <li>Whole site walled off without anyone noticing</li>
            </ul>
          </div>
        </div>

        <div className="cw-art-lane cw-art-lane--text">
          <div className="cw-art-lane__num">02</div>
          <div className="cw-art-lane__content">
            <h4 className="cw-art-lane__title">You rank nowhere underneath the answer.</h4>
            <p className="cw-art-lane__desc">
              Google&apos;s AI answer is assembled from the results below it, so if
              you hold page one you have a real shot at the box above it, and if you
              rank nowhere it will not invent you. This is also the job schema
              actually does. It earns the rich results and rankings that decide
              whether an answer fires for your category, rather than being read by
              the model, which usually never sees it.
            </p>
            <ul className="cw-art-lane__caps">
              <li>No page-one standing for a real buying phrase</li>
              <li>Missing or broken Organization, Service, and FAQ markup</li>
              <li>Nothing in classic search for the answer to draw on</li>
            </ul>
          </div>
        </div>

        <div className="cw-art-lane cw-art-lane--text">
          <div className="cw-art-lane__num">03</div>
          <div className="cw-art-lane__content">
            <h4 className="cw-art-lane__title">The content only exists after JavaScript runs.</h4>
            <p className="cw-art-lane__desc">
              If your text is painted in by a script, a crawler that does not run
              scripts sees an empty page. Server-rendered HTML means the answer is
              right there in the source, which is what AI crawlers actually read.
            </p>
            <ul className="cw-art-lane__caps">
              <li>JavaScript-only content the bot never sees</li>
              <li>Slow pages that time out mid-crawl</li>
              <li>Key copy locked inside widgets and embeds</li>
            </ul>
          </div>
        </div>

        <div className="cw-art-lane cw-art-lane--text">
          <div className="cw-art-lane__num">04</div>
          <div className="cw-art-lane__content">
            <h4 className="cw-art-lane__title">Nothing on the page is quotable.</h4>
            <p className="cw-art-lane__desc">
              AI answers lift short, clear statements. A page that is all slogans
              and stock photography gives it nothing to pull. Direct answers, real
              FAQs, and plain descriptions of what you do are what get quoted back
              to the person asking.
            </p>
            <ul className="cw-art-lane__caps">
              <li>Marketing copy with no quotable facts</li>
              <li>No FAQ or question-shaped content</li>
              <li>No llms.txt pointing to what matters</li>
            </ul>
          </div>
        </div>
      </div>

    </SectionShell>
  );
}

// The semantic Q&A coverage (AEO) section + the speed callout. New bespoke
// pattern (.cw-art-qa), reskinned to the global tokens.
export function ChatgptAnswers() {
  return (
    <SectionShell className="cw-art-section cw-art-qa-section">
      <div className="cw-art-section__eyebrow cw-art-qa__eyebrow">Asked and answered</div>
      <h2 className="cw-art-section__heading cw-art-qa__heading">
        What people actually type, answered plainly.
      </h2>

      <div className="cw-art-qa">
        <div className="cw-art-qa__item">
          <h3 className="cw-art-qa__q">How do I get my business on ChatGPT?</h3>
          <p className="cw-art-qa__a">
            Make your site easy for AI to read and quote. Allow the AI crawlers,
            add structured data that names your business and what it does, and write
            pages that answer the questions your customers ask. When the model
            trusts your site as a source, your name starts appearing in its
            answers. If you would rather pay for placement and skip the wait, that
            is <Link href="/advertising-on-chatgpt/">advertising on ChatGPT</Link>.
          </p>
        </div>
        <div className="cw-art-qa__item">
          <h3 className="cw-art-qa__q">How do I show up on ChatGPT for my industry?</h3>
          <p className="cw-art-qa__a">
            Win the specific questions your buyers ask, not the broad ones. Niche
            down. A tree service is better off being the obvious answer to
            &ldquo;emergency storm tree removal near Big Bend&rdquo; than fighting
            for &ldquo;best tree company in the state.&rdquo; Targeted, quotable
            content plus clean schema is how you get named in those answers.
          </p>
        </div>
        <div className="cw-art-qa__item">
          <h3 className="cw-art-qa__q">Why am I not coming up on ChatGPT?</h3>
          <p className="cw-art-qa__a">
            Most often because the AI cannot read you. The crawlers are blocked,
            there is no structured data, or the content is painted in by JavaScript
            and the bot sees a blank page. Sometimes you are readable but you have
            given the model nothing quotable. The audit checks each of these and
            tells you which one is the problem.
          </p>
        </div>
        <div className="cw-art-qa__item">
          <h3 className="cw-art-qa__q">How do I get cited by AI like ChatGPT and Perplexity?</h3>
          <p className="cw-art-qa__a">
            Become a clean, consistent source. AI engines cite businesses they can
            identify and trust: a defined entity with matching details across the
            web, structured data they can attribute claims to, and content that
            directly answers the question. You cannot force a citation, but you can
            remove every reason you are being skipped.
          </p>
        </div>
      </div>

      <div className="cw-art-qa__callout">
        <strong>Need to show up tomorrow, not next quarter?</strong> Organic
        visibility is durable but it takes time. If your business type is eligible,
        you can buy your way into the answer right now with{" "}
        <Link href="/advertising-on-chatgpt/">advertising on ChatGPT</Link>.
      </div>
    </SectionShell>
  );
}

// The 4-cell stat grid (proof). New bespoke pattern (.cw-art-statgrid).
export function ChatgptStatGrid() {
  return (
    <>
      <p className="cw-art-statgrid__lead">
        After I rebuilt Russ Tree Service to show up on ChatGPT, here is what
        RankScale and Google Search Console showed about a month after launch. Real
        client, real numbers, one month being a very short window.
      </p>
      <div className="cw-art-statgrid">
        <div className="cw-art-stat">
          <div className="cw-art-stat__for">Most-cited domain in the category</div>
          <div className="cw-art-stat__num">#1</div>
          <p className="cw-art-stat__desc">
            Of 114 domains AI pulled from for southeast Wisconsin tree service,
            russtreeservice.com was cited the most, a 12.6% share, ahead of
            directories like BBB and Angi.
          </p>
        </div>
        <div className="cw-art-stat">
          <div className="cw-art-stat__for">Average AI position</div>
          <div className="cw-art-stat__num">#6 to #3.1</div>
          <p className="cw-art-stat__desc">
            Where an AI placed the business when it named a tree service, climbing
            from position #6 to #3.1 in the first two weeks of tracking.
          </p>
        </div>
        <div className="cw-art-stat">
          <div className="cw-art-stat__for">AI visibility score</div>
          <div className="cw-art-stat__num">35.2%</div>
          <p className="cw-art-stat__desc">
            Second of 35 tracked brands in the category, with 74.2% positive
            sentiment. ChatGPT drove about 45% of that visibility.
          </p>
        </div>
        <div className="cw-art-stat cw-art-stat--honest">
          <div className="cw-art-stat__for">The honest version</div>
          <div className="cw-art-stat__num">Not magic</div>
          <p className="cw-art-stat__desc">
            Not every client cracks it that fast. A Brooklyn psychologist came to me
            at 22% AI readiness, his content buried in accordions and an image-only
            homepage the crawlers could not see. A month of work got him to 79%,
            invisible to ready. He is up against legacy institutions with marketers
            on retainer, so it has not turned into a steady citation yet, and I told
            him that going in. The audit gets you ready. Getting cited takes longer,
            and it comes faster when we niche down to the questions you can actually
            win.
          </p>
        </div>
      </div>
    </>
  );
}

// The two-panel pricing duo. New bespoke pattern (.cw-art-pricing-duo).
export function ChatgptPricingDuo() {
  return (
    <SectionShell className="cw-art-section cw-art-pricing-section">
      <div className="cw-art-section__eyebrow">What it costs</div>
      <h2 className="cw-art-section__heading">
        Start with the audit. Scale into the campaign.
      </h2>

      <div className="cw-art-pricing-duo">
        <div className="cw-art-pricing-panel">
          <div className="cw-art-pricing-panel__price">{money(AUDIT)}</div>
          <div className="cw-art-pricing-panel__sub">AI Visibility Audit, one-time</div>
          <p className="cw-art-pricing-panel__copy">
            The baseline. I check whether AI crawlers can reach you, whether your
            structured data is doing its job, whether your content is quotable, and
            where you stand against the businesses already getting cited. You get a
            prioritized fix list and a straight answer about what is realistic in
            your space.
          </p>
          <Link href="/contact/" className="cw-art-btn cw-art-btn--primary cw-art-pricing-panel__cta">
            Get visible for {money(AUDIT)}
          </Link>
        </div>

        <div className="cw-art-pricing-panel cw-art-pricing-panel--ongoing">
          <div className="cw-art-pricing-panel__price">
            {money(AI_VIZ_MONTHLY)}<span className="cw-art-pricing-panel__per"> / mo</span>
          </div>
          <div className="cw-art-pricing-panel__sub">AI Visibility Campaign, ongoing</div>
          <p className="cw-art-pricing-panel__copy">
            For businesses that want to keep compounding. Each month: updates to
            your anchor service pages so the algorithms see you active, one or two
            articles on market-researched questions people are actually asking, a
            weekly presence post for brand cohesion, review outreach, and a report
            you can read. You do nothing. I handle it.
          </p>
          <p className="cw-art-pricing-panel__disclaimer">
            The audit comes first. From there we decide together whether an ongoing
            campaign makes sense for your market. Nothing here is a formal quote.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
