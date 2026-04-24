import { FAVORS } from '../../config/favors';

export function FavorsSection() {
  return (
    <section className="favors-section" id="favors">
      <div className="favors-header">
        <div className="section-eyebrow">FAVORS &amp; GIFTING</div>
        <h2 className="section-title" style={{ marginTop: 14 }}>
          Little <em>keepsakes</em> your guests will hold onto.
        </h2>
        <div className="ornament">&starf;</div>
      </div>
      <div className="favors-row">
        {FAVORS.map((f, i) => (
          <div key={i} className="favor-card">
            <img src={f.img} alt={f.title} />
            <div className="favor-card-overlay">
              <div className="kind">{f.kind}</div>
              <div className="title">{f.title}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
