import { CATALOGUE } from '../../config/catalogue';

export function CatalogueSection() {
  return (
    <section className="catalogue-section" id="catalogue">
      <div className="catalogue-header">
        <div className="section-eyebrow">THE CATALOGUE</div>
        <h2 className="section-title">
          A few moments
          <br />
          we&rsquo;ve <em>curated</em>.
        </h2>
        <p className="section-lede" style={{ color: 'rgba(246,236,223,.7)', margin: '20px auto 0' }}>
          A look inside recent invites, trays and baskets.
          Tap any piece to hear what we made for them &mdash; we&rsquo;ll build yours the same way.
        </p>
      </div>

      <div className="masonry">
        {CATALOGUE.map((c, i) => (
          <div key={i} style={{ height: c.h }}>
            <img
              src={c.img}
              alt={c.label}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="tile-label">{c.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
