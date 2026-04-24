import { useState, useEffect, useRef } from 'react';
import { useSectionProgress } from '../../hooks';

export function InvitesSection() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('Faheem Ahmed Khan');

  const sectionRef = useRef(null);
  const prog = useSectionProgress(sectionRef);

  // open the envelope automatically when in view
  useEffect(() => {
    if (prog > 0.35 && prog < 0.9) setOpen(true);
  }, [prog]);

  return (
    <section className="invite-section" id="invites" ref={sectionRef}>
      <div className="invite-grid">
        {/* Envelope */}
        <div className="envelope-stage" onClick={() => setOpen((o) => !o)}>
          <div
            className="envelope-wrap"
            style={{
              transform: `rotateX(${10 - prog * 20}deg) rotateY(${-8 + prog * 16}deg)`,
            }}
          >
            <div className="envelope-back" />
            <div
              className={`envelope-stage ${open ? 'open' : ''}`}
              style={{ position: 'absolute', inset: 0, cursor: 'pointer' }}
            >
              <div className="envelope-card">
                <div className="from">With best wishes from</div>
                <div className="rule" />
                <div className="name">{name.toUpperCase()}</div>
                <div
                  style={{
                    fontFamily: '"Cormorant SC", serif',
                    fontSize: 10,
                    letterSpacing: '.3em',
                    color: 'var(--dust)',
                  }}
                >
                  &#xFE61; SE INVITES &#xFE61;
                </div>
              </div>
              <div className="envelope-flap" />
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: '"Cormorant SC", serif',
              fontSize: 10,
              letterSpacing: '.3em',
              color: 'var(--dust)',
            }}
          >
            CLICK TO {open ? 'CLOSE' : 'OPEN'}
          </div>
        </div>

        {/* Copy */}
        <div>
          <div className="section-eyebrow">E-INVITES &middot; ENVELOPES &middot; SWEET BOXES</div>
          <h2 className="section-title" style={{ marginTop: 14 }}>
            Every <em>name</em>
            <br />
            engraved by hand.
          </h2>
          <p className="section-lede" style={{ marginTop: 22 }}>
            Customized envelopes, sweet boxes and e-invites &mdash; pair English, Urdu
            or Arabic names with your chosen palette. We typeset each one, proof
            it with you, and send it either as a printed keepsake or an animated
            digital invite.
          </p>

          <div style={{ marginTop: 32, maxWidth: 420 }}>
            <label
              style={{
                display: 'block',
                fontFamily: '"Cormorant SC", serif',
                fontSize: 11,
                letterSpacing: '.3em',
                color: 'var(--maroon)',
                marginBottom: 10,
              }}
            >
              TRY IT &mdash; TYPE A NAME
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fatima Ahmed"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'transparent',
                border: '1px solid var(--maroon)',
                color: 'var(--maroon-deep)',
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 18,
                outline: 'none',
              }}
            />
            <button onClick={() => setOpen(true)} className="btn btn-primary" style={{ marginTop: 14 }}>
              See it on the envelope
            </button>
          </div>

          <div style={{ display: 'flex', gap: 24, marginTop: 36, flexWrap: 'wrap' }}>
            {[
              { t: 'Printed envelopes', s: 'Textured ivory & blush card' },
              { t: 'Sweet boxes', s: 'Name in English + Urdu/Arabic' },
              { t: 'Animated e-invites', s: 'WhatsApp-ready video & link' },
            ].map((f, i) => (
              <div key={i} style={{ borderLeft: '1px solid var(--gold)', paddingLeft: 14, maxWidth: 170 }}>
                <div
                  style={{
                    fontFamily: '"Cormorant SC", serif',
                    fontSize: 10,
                    letterSpacing: '.25em',
                    color: 'var(--maroon)',
                  }}
                >
                  0{i + 1}
                </div>
                <div
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 18,
                    color: 'var(--maroon-deep)',
                    marginTop: 4,
                  }}
                >
                  {f.t}
                </div>
                <div style={{ fontSize: 14, color: '#6b434a', marginTop: 4 }}>{f.s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
