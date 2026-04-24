import { SELogoMark } from '../../svg';

export function CTASection() {
  return (
    <section className="cta-section" id="order">
      <div className="hex-badge-big">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <SELogoMark size={78} />
          <div
            style={{
              fontFamily: '"Cormorant SC", serif',
              letterSpacing: '.34em',
              fontSize: 10,
              color: 'var(--maroon)',
              marginTop: 2,
            }}
          >
            INVITES
          </div>
        </div>
      </div>
      <div className="section-eyebrow">READY TO BEGIN?</div>
      <h2 className="section-title" style={{ marginTop: 12 }}>
        Let&rsquo;s build <em>yours</em>.
      </h2>
      <p className="section-lede" style={{ margin: '22px auto 0' }}>
        Send us the date. We&rsquo;ll come back with a mood-board, a quote, and a little sketch
        of what we think your tray, invite or basket should be.
      </p>
      <div className="hero-ctas" style={{ justifyContent: 'center', marginTop: 30 }}>
        <a
          className="btn btn-primary"
          href="https://instagram.com/se_invites"
          target="_blank"
          rel="noreferrer"
        >
          Start on Instagram &rarr;
        </a>
        <a className="btn btn-ghost" href="mailto:hello@se-invites.com">
          Email us
        </a>
      </div>

      <a
        className="cta-ig"
        href="https://instagram.com/se_invites"
        target="_blank"
        rel="noreferrer"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
        </svg>
        @se_invites
      </a>
    </section>
  );
}
