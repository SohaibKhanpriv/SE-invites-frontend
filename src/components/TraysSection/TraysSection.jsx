import { useState, useEffect, useRef } from 'react';
import { useSectionProgress } from '../../hooks';
import { TRAYS } from '../../config/trays';

export function TraysSection() {
  const [idx, setIdx] = useState(0);
  const sectionRef = useRef(null);
  const prog = useSectionProgress(sectionRef);

  // auto rotate
  useEffect(() => {
    const timer = setInterval(() => setIdx((i) => (i + 1) % TRAYS.length), 5500);
    return () => clearInterval(timer);
  }, []);

  const current = TRAYS[idx];
  const ringRadius = 280;
  const step = 360 / TRAYS.length;
  const groupRotY = -idx * step;
  const wobble = (prog - 0.5) * 20;

  return (
    <section className="trays-section" id="trays" ref={sectionRef}>
      <div className="trays-grid">
        <div className="trays-copy">
          <div className="section-eyebrow">RING &amp; NIKKAH TRAYS</div>
          <h2 className="section-title">
            Mirrors that <em>remember</em>
            <br />
            the day you said yes.
          </h2>
          <p className="section-lede">
            Every tray is a one-of-one. Pick the base, the floral crown, the typography,
            and the names you want carried forward. We build it. We deliver it boxed,
            lit and ribbon-tied.
          </p>
          <div className="tray-chips">
            {TRAYS.map((t, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`tray-chip ${idx === i ? 'active' : ''}`}
              >
                {t.title}
              </button>
            ))}
          </div>
          <div
            style={{
              marginTop: 32,
              paddingTop: 24,
              borderTop: '1px solid rgba(107,31,42,.2)',
              maxWidth: 440,
            }}
          >
            <div className="section-eyebrow" style={{ fontSize: 10 }}>
              {current.tag}
            </div>
            <div
              style={{
                fontFamily: 'Pinyon Script, cursive',
                fontSize: 38,
                color: 'var(--maroon)',
                lineHeight: 1.1,
                margin: '8px 0 10px',
              }}
            >
              {current.title}
            </div>
            <div style={{ fontSize: 17, lineHeight: 1.55, color: '#4a2a2f' }}>
              {current.desc}
            </div>
          </div>
        </div>

        <div className="tray-stage">
          <div
            className="tray-carousel"
            style={{
              transform: `rotateX(-14deg) rotateY(${groupRotY + wobble}deg)`,
            }}
          >
            {TRAYS.map((t, i) => {
              const ang = i * step;
              const isActive = i === idx;
              return (
                <div
                  key={i}
                  className="tray-face"
                  style={{
                    transform: `rotateY(${ang}deg) translateZ(${ringRadius}px)`,
                    opacity: isActive ? 1 : 0.55,
                    transition: 'opacity .6s ease',
                  }}
                >
                  <img src={t.img} alt={t.title} />
                </div>
              );
            })}
          </div>
          <div className="tray-pedestal" />
          <div
            style={{
              position: 'absolute',
              bottom: -60,
              left: 0,
              right: 0,
              textAlign: 'center',
              fontFamily: '"Cormorant SC", serif',
              fontSize: 11,
              letterSpacing: '.3em',
              color: 'var(--dust)',
            }}
          >
            SLIDE {String(idx + 1).padStart(2, '0')} /{' '}
            {String(TRAYS.length).padStart(2, '0')} &middot; AUTO-ROTATING
          </div>
        </div>
      </div>
    </section>
  );
}
