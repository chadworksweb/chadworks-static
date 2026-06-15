// Anti-agency voicebox: a faithful, RESKINNED reproduction of the "industry_voice"
// section from the source septic marketing page. The markup, all 16 thread messages,
// and every word are copied verbatim (real email exchange, names changed). Only the
// CSS tokens change -- mapped to the global design system. Server component; the
// "Show full thread" toggle is a real <details> element (no JS). The page wraps this
// block, so the root is a plain <div> (no SectionShell).

export function SepticVoicebox() {
  return (
    <div className="cw-art-voice">
      <div className="cw-art-voice__layout">
        <div className="cw-art-voice__main">
          <div className="cw-art-voice__eyebrow">Going to bat for clients like yours</div>
          <h2 className="cw-art-voice__heading">
            Is your agency ripping you off?<br className="cw-art-voice__desktop-br" /> I go to bat for my clients.
          </h2>
          <p className="cw-art-voice__lead">
            Real exchange with a client&apos;s previous agency, December 2023. My client{" "}
            <span className="cw-art-voice__char cw-art-voice__char--client">Greg</span> had been billed{" "}
            <em>$1,000 a month</em> by{" "}
            <span className="cw-art-voice__char cw-art-voice__char--agency">Pixelborn</span> for what amounted to
            hosting.{" "}
            <span className="cw-art-voice__char cw-art-voice__char--manager">Karen Brennan</span>, their business
            manager, handled the cancellation paperwork. I sent{" "}
            <span className="cw-art-voice__char cw-art-voice__char--prod">Bob Hall</span>, their production lead, this
            email on the way out.{" "}
            <span className="cw-art-voice__aside">(Obviously, names have been changed to protect privacy.)</span>
          </p>

          <div className="cw-art-thread">
            <div className="cw-art-thread__header">
              <div className="cw-art-thread__subject">Cancellation of Services with Pixelborn</div>
              <div className="cw-art-thread__meta">Inbox &middot; 16 messages</div>
            </div>

            <article className="cw-art-thread__msg">
              <div className="cw-art-thread__avatar cw-art-thread__avatar--them" aria-hidden="true">
                K
              </div>
              <div className="cw-art-thread__body">
                <div className="cw-art-thread__meta-row">
                  <span className="cw-art-thread__from">
                    <strong>Karen Brennan</strong>
                    <span>k.brennan@pixelborn.net</span>
                  </span>
                  <span className="cw-art-thread__date">Dec 14, 2023, 1:44&nbsp;PM</span>
                </div>
                <div className="cw-art-thread__to">to Greg, Chad, +8 others</div>
                <p className="cw-art-thread__text">Hi Greg:</p>
                <p className="cw-art-thread__text">
                  Thank you for your email. According to our policy and contract that you signed with us dated 1/14/21,
                  we require 60 days advance cancellation notice of your contract renewal date...{" "}
                  <mark>
                    Payment of InvC-17453 due on 12/15, paid on 12/11/23, provides full site, service, and support
                    through the transition process.
                  </mark>
                </p>
                <p className="cw-art-thread__text">Have a very Merry Christmas and a joy-filled New Year!</p>
              </div>
            </article>

            <div className="cw-art-thread__gap" aria-label="13 messages omitted">
              <span className="cw-art-thread__gap-dots" aria-hidden="true">
                &middot;&middot;&middot;
              </span>
              <span className="cw-art-thread__gap-label">13 messages between</span>
              <span className="cw-art-thread__gap-dots" aria-hidden="true">
                &middot;&middot;&middot;
              </span>
            </div>

            <article className="cw-art-thread__msg cw-art-thread__msg--mine">
              <div className="cw-art-thread__avatar cw-art-thread__avatar--me" aria-hidden="true">
                C
              </div>
              <div className="cw-art-thread__body">
                <div className="cw-art-thread__meta-row">
                  <span className="cw-art-thread__from">
                    <strong>Chad</strong>
                    <span>chad@chadworks.co</span>
                  </span>
                  <span className="cw-art-thread__date">Dec 15, 2023, 7:29&nbsp;AM</span>
                </div>
                <div className="cw-art-thread__to">to Bob Hall (Pixelborn Production)</div>
                <p className="cw-art-thread__text">Thanks.</p>
                <p className="cw-art-thread__text">
                  The process to leave as a client is far more difficult than it should be.
                </p>
                <p className="cw-art-thread__text">
                  <mark>
                    I can&apos;t believe the company was charging this client $1,000 a month for essentially just
                    hosting. I know it, you know it.
                  </mark>{" "}
                  Please consider being more conscionable with clients. This situation is why web designers get a bad
                  rap. The company was blatantly ripping him off for years. He didn&apos;t take advantage of the
                  service, so they should have downgraded him long long ago.
                </p>
                <p className="cw-art-thread__text">
                  But, personally to you, thanks for helping complete the process.
                </p>
              </div>
            </article>
          </div>

          <details className="cw-art-thread__toggle">
            <summary>
              <span className="cw-art-thread__toggle-label">Show full thread</span>
              <span className="cw-art-thread__toggle-count">16 messages</span>
            </summary>

            <div className="cw-art-thread__full">
              <article className="cw-art-thread__msg">
                <div className="cw-art-thread__avatar cw-art-thread__avatar--them" aria-hidden="true">
                  P
                </div>
                <div className="cw-art-thread__body">
                  <div className="cw-art-thread__meta-row">
                    <span className="cw-art-thread__from">
                      <strong>Pixelborn Accounting</strong>
                      <span>accounting@pixelborn.net</span>
                    </span>
                    <span className="cw-art-thread__date">Dec 14, 2023, 10:52&nbsp;AM</span>
                  </div>
                  <div className="cw-art-thread__to">to Greg, Chad, +7 others</div>
                  <p className="cw-art-thread__text">
                    Hi Greg: Our team has informed me of your cancellation notice via the email dated 11/7/23 you sent
                    to Matt, our Director - Account Management. According to our records, on 11/17/23, Matt emailed
                    details of the Exit Process to address all questions for both you and Chad as your new provider.
                    Site files were sent on 11/27/23 via Dropbox by Bob, our Director - Production.
                  </p>
                  <p className="cw-art-thread__text">
                    Final payment in the amount of $1,000 for your InvC-17453 cleared our banking on 12/11/23. This
                    payment will give you site and online marketing services with our company through end of day Monday,
                    1/15/24 allowing you and Chad valuable time to transition your site away from Pixelborn servers.
                  </p>
                  <p className="cw-art-thread__text">
                    Thank you, Greg, for allowing our Team the opportunity to work with you over the past two years. We
                    are sorry to lose you as a valued customer and wish you all the best going forward.
                  </p>
                </div>
              </article>

              <article className="cw-art-thread__msg">
                <div className="cw-art-thread__avatar cw-art-thread__avatar--them" aria-hidden="true">
                  K
                </div>
                <div className="cw-art-thread__body">
                  <div className="cw-art-thread__meta-row">
                    <span className="cw-art-thread__from">
                      <strong>Karen Brennan</strong>
                      <span>k.brennan@pixelborn.net</span>
                    </span>
                    <span className="cw-art-thread__date">Dec 14, 2023, 1:44&nbsp;PM</span>
                  </div>
                  <div className="cw-art-thread__to">to Greg, Chad, +8 others</div>
                  <p className="cw-art-thread__text">
                    Hi Greg: Thank you for your email. According to our policy and contract that you signed with us dated
                    1/14/21, we require 60 days advance cancellation notice of your contract renewal date. The first
                    request received in writing to cancel our services I was able to view in our system was dated
                    11/7/23, which would be in line with those contract terms. In order to fulfill the terms of your
                    contract with us, it was our expectation that you would pay us for services rendered which you have
                    done.
                  </p>
                  <p className="cw-art-thread__text">
                    Payment of InvC-17453 due on 12/15, paid on 12/11/23, provides full site, service, and support
                    through the transition process. As your new provider, Chad, will have through the end of day 1/15/24
                    to transition your site away from our Pixelborn servers.
                  </p>
                  <p className="cw-art-thread__text">Have a very Merry Christmas and a joy-filled New Year!</p>
                </div>
              </article>

              <article className="cw-art-thread__msg cw-art-thread__msg--mine">
                <div className="cw-art-thread__avatar cw-art-thread__avatar--me" aria-hidden="true">
                  C
                </div>
                <div className="cw-art-thread__body">
                  <div className="cw-art-thread__meta-row">
                    <span className="cw-art-thread__from">
                      <strong>Chad</strong>
                      <span>chad@chadworks.co</span>
                    </span>
                    <span className="cw-art-thread__date">Dec 14, 2023, 2:25&nbsp;PM</span>
                  </div>
                  <div className="cw-art-thread__to">to Karen Brennan</div>
                  <p className="cw-art-thread__text">Thanks Karen.</p>
                  <p className="cw-art-thread__text">
                    I just want access to the WPadmin so I can do a one click migration. Please allow me to do that. I
                    know you have it in the fine print that you don&apos;t allow that, and I get that for some other
                    websites, but for this one, it&apos;s just not that serious.
                  </p>
                  <p className="cw-art-thread__text">
                    You can remove your proprietary plugins now or at least take my word that we won&apos;t use them.
                    Please make this as easy for Greg as possible.
                  </p>
                  <p className="cw-art-thread__text">Please let me know.</p>
                </div>
              </article>

              <article className="cw-art-thread__msg">
                <div className="cw-art-thread__avatar cw-art-thread__avatar--them" aria-hidden="true">
                  K
                </div>
                <div className="cw-art-thread__body">
                  <div className="cw-art-thread__meta-row">
                    <span className="cw-art-thread__from">
                      <strong>Karen Brennan</strong>
                      <span>k.brennan@pixelborn.net</span>
                    </span>
                    <span className="cw-art-thread__date">Dec 14, 2023, 3:00&nbsp;PM</span>
                  </div>
                  <div className="cw-art-thread__to">to Chad</div>
                  <p className="cw-art-thread__text">
                    Hi Chad: Thank you for your email. We have a contractual, legal obligation to all of our customers
                    using a shared server. Our customers all have the option of having a dedicated server if this is
                    needed or desired, although we do have an extra fee for this.
                  </p>
                  <p className="cw-art-thread__text">
                    While we have had some ask along the way for Admin Access for a variety of reasons, it is generally
                    because people doing the asking do not understand the possibilities of what could happen. As the
                    Business Manager here for Pixelborn, I handle the Accounting and HR functions. I will leave it up to
                    our Management Team to discuss this request on your behalf and ask that someone gets back to you as
                    soon as possible.
                  </p>
                </div>
              </article>

              <article className="cw-art-thread__msg cw-art-thread__msg--mine">
                <div className="cw-art-thread__avatar cw-art-thread__avatar--me" aria-hidden="true">
                  C
                </div>
                <div className="cw-art-thread__body">
                  <div className="cw-art-thread__meta-row">
                    <span className="cw-art-thread__from">
                      <strong>Chad</strong>
                      <span>chad@chadworks.co</span>
                    </span>
                    <span className="cw-art-thread__date">Dec 14, 2023, 3:22&nbsp;PM</span>
                  </div>
                  <div className="cw-art-thread__to">to Karen Brennan</div>
                  <p className="cw-art-thread__text">Thank you. Awaiting their reply.</p>
                </div>
              </article>

              <article className="cw-art-thread__msg">
                <div className="cw-art-thread__avatar cw-art-thread__avatar--them" aria-hidden="true">
                  B
                </div>
                <div className="cw-art-thread__body">
                  <div className="cw-art-thread__meta-row">
                    <span className="cw-art-thread__from">
                      <strong>Bob Hall</strong>
                      <span>b.hall@pixelborn.net</span>
                    </span>
                    <span className="cw-art-thread__date">Dec 14, 2023, 3:30&nbsp;PM</span>
                  </div>
                  <div className="cw-art-thread__to">to Chad</div>
                  <p className="cw-art-thread__text">Good afternoon Chad,</p>
                  <p className="cw-art-thread__text">
                    As Karen stated, it is our policy to not give full admin access to our customers not only because
                    they are on a shared server but because of the proprietary software we create and licenses we
                    purchase for our customers. We have provided you with a copy of the site minus these assets along
                    with the instructions for how to get the new site up and running. Please review these instructions
                    and I&apos;m sure you&apos;ll find this process is really simple for you.
                  </p>
                </div>
              </article>

              <article className="cw-art-thread__msg cw-art-thread__msg--mine">
                <div className="cw-art-thread__avatar cw-art-thread__avatar--me" aria-hidden="true">
                  C
                </div>
                <div className="cw-art-thread__body">
                  <div className="cw-art-thread__meta-row">
                    <span className="cw-art-thread__from">
                      <strong>Chad</strong>
                      <span>chad@chadworks.co</span>
                    </span>
                    <span className="cw-art-thread__date">Dec 14, 2023, 3:38&nbsp;PM</span>
                  </div>
                  <div className="cw-art-thread__to">to Bob Hall</div>
                  <p className="cw-art-thread__text">Where did the copy of the site go?</p>
                </div>
              </article>

              <article className="cw-art-thread__msg">
                <div className="cw-art-thread__avatar cw-art-thread__avatar--them" aria-hidden="true">
                  B
                </div>
                <div className="cw-art-thread__body">
                  <div className="cw-art-thread__meta-row">
                    <span className="cw-art-thread__from">
                      <strong>Bob Hall</strong>
                      <span>b.hall@pixelborn.net</span>
                    </span>
                    <span className="cw-art-thread__date">Dec 14, 2023, 3:44&nbsp;PM</span>
                  </div>
                  <div className="cw-art-thread__to">to Chad</div>
                  <p className="cw-art-thread__text">
                    I&apos;ve re-shared the dropbox with you. Below is a link to it as well: [link redacted]
                  </p>
                </div>
              </article>

              <article className="cw-art-thread__msg cw-art-thread__msg--mine">
                <div className="cw-art-thread__avatar cw-art-thread__avatar--me" aria-hidden="true">
                  C
                </div>
                <div className="cw-art-thread__body">
                  <div className="cw-art-thread__meta-row">
                    <span className="cw-art-thread__from">
                      <strong>Chad</strong>
                      <span>chad@chadworks.co</span>
                    </span>
                    <span className="cw-art-thread__date">Dec 14, 2023, 3:45&nbsp;PM</span>
                  </div>
                  <div className="cw-art-thread__to">to Bob Hall</div>
                  <p className="cw-art-thread__text">Got it! Thank you.</p>
                </div>
              </article>

              <article className="cw-art-thread__msg cw-art-thread__msg--mine">
                <div className="cw-art-thread__avatar cw-art-thread__avatar--me" aria-hidden="true">
                  C
                </div>
                <div className="cw-art-thread__body">
                  <div className="cw-art-thread__meta-row">
                    <span className="cw-art-thread__from">
                      <strong>Chad</strong>
                      <span>chad@chadworks.co</span>
                    </span>
                    <span className="cw-art-thread__date">Dec 14, 2023, 3:47&nbsp;PM</span>
                  </div>
                  <div className="cw-art-thread__to">to Bob Hall</div>
                  <p className="cw-art-thread__text">
                    What will Greg need to use this for? &ldquo;Pixelborn has created an admin account for you to use
                    once you have your site moved:&rdquo;
                  </p>
                </div>
              </article>

              <article className="cw-art-thread__msg">
                <div className="cw-art-thread__avatar cw-art-thread__avatar--them" aria-hidden="true">
                  B
                </div>
                <div className="cw-art-thread__body">
                  <div className="cw-art-thread__meta-row">
                    <span className="cw-art-thread__from">
                      <strong>Bob Hall</strong>
                      <span>b.hall@pixelborn.net</span>
                    </span>
                    <span className="cw-art-thread__date">Dec 14, 2023, 3:49&nbsp;PM</span>
                  </div>
                  <div className="cw-art-thread__to">to Chad</div>
                  <p className="cw-art-thread__text">
                    Chad, That ensures that once you re-create the site on the new server, you have a full admin account
                    to use to manage the new site.
                  </p>
                </div>
              </article>

              <article className="cw-art-thread__msg cw-art-thread__msg--mine">
                <div className="cw-art-thread__avatar cw-art-thread__avatar--me" aria-hidden="true">
                  C
                </div>
                <div className="cw-art-thread__body">
                  <div className="cw-art-thread__meta-row">
                    <span className="cw-art-thread__from">
                      <strong>Chad</strong>
                      <span>chad@chadworks.co</span>
                    </span>
                    <span className="cw-art-thread__date">Dec 14, 2023, 3:50&nbsp;PM</span>
                  </div>
                  <div className="cw-art-thread__to">to Bob Hall</div>
                  <p className="cw-art-thread__text">
                    Gotcha. I didn&apos;t know if it was for Pixelborn invoice history or something. Thank you.
                  </p>
                </div>
              </article>

              <article className="cw-art-thread__msg cw-art-thread__msg--mine">
                <div className="cw-art-thread__avatar cw-art-thread__avatar--me" aria-hidden="true">
                  C
                </div>
                <div className="cw-art-thread__body">
                  <div className="cw-art-thread__meta-row">
                    <span className="cw-art-thread__from">
                      <strong>Chad</strong>
                      <span>chad@chadworks.co</span>
                    </span>
                    <span className="cw-art-thread__date">Dec 14, 2023, 4:21&nbsp;PM</span>
                  </div>
                  <div className="cw-art-thread__to">to Bob Hall</div>
                  <p className="cw-art-thread__text">
                    I keep getting stuck early on in the extraction. Can you send as a .zip please?
                  </p>
                </div>
              </article>

              <article className="cw-art-thread__msg cw-art-thread__msg--mine">
                <div className="cw-art-thread__avatar cw-art-thread__avatar--me" aria-hidden="true">
                  C
                </div>
                <div className="cw-art-thread__body">
                  <div className="cw-art-thread__meta-row">
                    <span className="cw-art-thread__from">
                      <strong>Chad</strong>
                      <span>chad@chadworks.co</span>
                    </span>
                    <span className="cw-art-thread__date">Dec 14, 2023, 4:26&nbsp;PM</span>
                  </div>
                  <div className="cw-art-thread__to">to Bob Hall</div>
                  <p className="cw-art-thread__text">both archives, please, as zips.</p>
                </div>
              </article>

              <article className="cw-art-thread__msg">
                <div className="cw-art-thread__avatar cw-art-thread__avatar--them" aria-hidden="true">
                  B
                </div>
                <div className="cw-art-thread__body">
                  <div className="cw-art-thread__meta-row">
                    <span className="cw-art-thread__from">
                      <strong>Bob Hall</strong>
                      <span>b.hall@pixelborn.net</span>
                    </span>
                    <span className="cw-art-thread__date">Dec 14, 2023, 4:39&nbsp;PM</span>
                  </div>
                  <div className="cw-art-thread__to">to Chad</div>
                  <p className="cw-art-thread__text">
                    Sorry Chad, I can not. They are zipped up from the server and the source files have been removed from
                    the staging server. You&apos;ll need to get an app that can handle .gz files. That should fix the
                    issue you&apos;re having.
                  </p>
                </div>
              </article>

              <article className="cw-art-thread__msg cw-art-thread__msg--mine">
                <div className="cw-art-thread__avatar cw-art-thread__avatar--me" aria-hidden="true">
                  C
                </div>
                <div className="cw-art-thread__body">
                  <div className="cw-art-thread__meta-row">
                    <span className="cw-art-thread__from">
                      <strong>Chad</strong>
                      <span>chad@chadworks.co</span>
                    </span>
                    <span className="cw-art-thread__date">Dec 15, 2023, 7:29&nbsp;AM</span>
                  </div>
                  <div className="cw-art-thread__to">to Bob Hall</div>
                  <p className="cw-art-thread__text">Thanks.</p>
                  <p className="cw-art-thread__text">
                    The process to leave as a client is far more difficult than it should be.
                  </p>
                  <p className="cw-art-thread__text">
                    I can&apos;t believe the company was charging this client $1,000 a month for essentially just
                    hosting. I know it, you know it. Please consider being more conscionable with clients. This situation
                    is why web designers get a bad rap. The company was blatantly ripping him off for years. He
                    didn&apos;t take advantage of the service, so they should have downgraded him long long ago.
                  </p>
                  <p className="cw-art-thread__text">
                    But, personally to you, thanks for helping complete the process.
                  </p>
                </div>
              </article>
            </div>
          </details>

          <p className="cw-art-thread__caption">
            Names changed to protect the client and former agency. The exchange is real.
          </p>
        </div>
        {/* /.cw-art-voice__main */}
        <div className="cw-art-voice__aside-img" aria-hidden="true">
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
      {/* /.cw-art-voice__layout */}
    </div>
  );
}
