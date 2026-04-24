import { useRef } from 'react';
import { useStickyProgress } from '../../hooks';
import { BasketBackSVG, BasketFrontSVG } from '../../svg';
import { BASKET_ITEMS } from '../../config/basketItems';
import { arcLerp } from '../../utils/math';

export function BasketSection() {
  const wrapRef = useRef(null);
  const p = useStickyProgress(wrapRef);

  const activeIdx = Math.floor(Math.min(p, 0.999) * BASKET_ITEMS.length * 1.02);
  const basketRotY = (p - 0.5) * 6;
  const basketRotX = -4 + p * 4;

  return (
    <section className="basket-section" id="baskets">
      <div className="basket-scroll-wrap" ref={wrapRef}>
        <div className="basket-sticky">
          {/* fireflies */}
          {[...Array(26)].map((_, i) => (
            <div
              key={i}
              className="firefly"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
                animationDelay: `${(i % 7) * 0.3}s`,
                animationDuration: `${2 + (i % 5) * 0.4}s`,
              }}
            />
          ))}

          <div className="basket-scene">
            {/* Copy side */}
            <div className="basket-copy">
              <div className="section-eyebrow">CUSTOM GIFT BASKETS</div>
              <h2 className="section-title">
                Watch it come
                <br />
                <em>together</em>.
              </h2>
              <p>
                Tell us the person. We shop, wrap, light it up and deliver.
                Every basket is a story we assemble by hand, piece by piece.
              </p>

              <div className="basket-step-list">
                {BASKET_ITEMS.map((it, i) => (
                  <div key={i} className={`basket-step ${i <= activeIdx ? 'active' : ''}`}>
                    <div className="basket-step-num">{String(i + 1).padStart(2, '0')}</div>
                    <div className="basket-step-label">{it.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 30 }}>
                <a
                  className="btn btn-ghost"
                  href="#order"
                  style={{ borderColor: 'var(--gold-soft)', color: 'var(--gold-soft)' }}
                >
                  Customize a basket &rarr;
                </a>
              </div>
            </div>

            {/* 3D basket stage */}
            <div className="basket-stage-wrap">
              <div className="basket-stage">
                <div className="basket-floor-glow" />

                <div
                  className="basket-3d"
                  style={{
                    transform: `rotateX(${basketRotX}deg) rotateY(${basketRotY}deg)`,
                  }}
                >
                  {/* Back layer */}
                  <div className="basket-layer basket-layer-back">
                    <BasketBackSVG />
                  </div>

                  {/* Items flying in */}
                  {BASKET_ITEMS.map((it, i) => {
                    const start = it.delay;
                    const travelDur = 0.22;
                    const end = start + travelDur;
                    const t = Math.max(0, Math.min(1, (p - start) / (end - start)));
                    const ease = 1 - Math.pow(1 - t, 3);
                    const bounce = t > 0.85 ? Math.sin(((t - 0.85) / 0.15) * Math.PI) * 6 : 0;

                    const tx = arcLerp(it.from.x, it.peak.x, it.to.x, ease);
                    const ty = arcLerp(it.from.y, it.peak.y, it.to.y, ease) + bounce;
                    const tz = arcLerp(it.from.z, it.peak.z, it.to.z, ease);
                    const rx = arcLerp(it.from.rx, it.peak.rx, it.to.rx, ease);
                    const ry = arcLerp(it.from.ry, it.peak.ry, it.to.ry, ease);
                    const rz = arcLerp(it.from.rz, it.peak.rz, it.to.rz, ease);
                    const scale = arcLerp(it.from.s, it.peak.s, it.to.s, ease);
                    const opacity = Math.min(1, t * 4);
                    const zBase = 10 + it.to.bed;
                    const shadowStrength = Math.max(0, (ease - 0.55) / 0.45);

                    return (
                      <div
                        key={i}
                        className="basket-item-3d"
                        style={{
                          transform: `
                            translate3d(calc(${tx}px - 50%), calc(${ty}px - 50%), ${tz}px)
                            rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)
                            scale(${scale})
                          `,
                          opacity,
                          zIndex: zBase,
                          width: it.size,
                          height: it.size,
                          filter: `
                            drop-shadow(0 ${12 * scale}px ${18 * scale}px rgba(0,0,0,${0.4 * shadowStrength}))
                            drop-shadow(0 ${4 * scale}px ${6 * scale}px rgba(0,0,0,${0.25 * shadowStrength}))
                          `,
                        }}
                      >
                        <it.Svg />
                      </div>
                    );
                  })}

                  {/* Front layer */}
                  <div className="basket-layer basket-layer-front">
                    <BasketFrontSVG />
                  </div>
                </div>

                <div className="basket-progress-caption">
                  {Math.round(Math.min(p, 1) * 100)}% ASSEMBLED &middot; KEEP SCROLLING
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
