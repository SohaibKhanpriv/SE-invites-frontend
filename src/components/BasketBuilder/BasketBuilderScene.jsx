import { useState, useRef, useEffect, useCallback } from 'react';
import { GoldBasketBack } from '../../svg/GoldBasketBack';
import { GoldBasketFront } from '../../svg/GoldBasketFront';
import { CATEGORIES, BASKET_RESTS } from '../../config/builderProducts';
import { CasinoCounter } from './CasinoCounter';
import { arcLerp } from '../../utils/math';

const FLIGHT_IN_MS = 1400;
const FLIGHT_OUT_MS = 900;
const PLACEHOLDER = (name) =>
  `https://placehold.co/200x200/f6ecdf/6b1f2a?text=${encodeURIComponent(name)}`;

export function BasketBuilderScene({ tweaks = {} }) {
  const {
    counterStyle = 'cream',
    markup = 1.1,
    motionMult = 1.0,
    emptyCopy = 'Pick a category. Click a piece. Watch it land.',
    hoverIntensity = 'normal',
  } = tweaks;

  const [items, setItems] = useState([]);
  const [openCat, setOpenCat] = useState('suits');
  const [now, setNow] = useState(0);
  const stageRef = useRef(null);
  const rafRef = useRef(null);

  // rAF loop — drives animation clock
  useEffect(() => {
    const tick = () => {
      setNow(performance.now());
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Compute resting item count
  const restingCount = items.filter(
    (it) => it.dir === 1 && (now - it.startTime) / (FLIGHT_IN_MS / motionMult) >= 0.99
  ).length;

  const handleAddProduct = useCallback(
    (product, e) => {
      const stage = stageRef.current;
      if (!stage) return;

      const stageRect = stage.getBoundingClientRect();
      const stageCX = stageRect.left + stageRect.width / 2;
      const stageCY = stageRect.top + stageRect.height / 2;

      // Find origin from clicked thumbnail
      const thumb = e.currentTarget.querySelector('.prod-thumb');
      let originX = -300;
      let originY = -200;
      if (thumb) {
        const tr = thumb.getBoundingClientRect();
        originX = tr.left + tr.width / 2 - stageCX;
        originY = tr.top + tr.height / 2 - stageCY;
      }

      const currentResting = items.filter((it) => it.dir === 1).length;

      setItems((prev) => [
        ...prev,
        {
          id: `it-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          product,
          slot: product.basketSlot,
          restIndex: currentResting % BASKET_RESTS.length,
          dir: 1,
          startTime: performance.now(),
          duration: FLIGHT_IN_MS / motionMult,
          origin: { x: originX, y: originY },
        },
      ]);
    },
    [items, motionMult]
  );

  const handleRemoveItem = useCallback(
    (itemId) => {
      setItems((prev) =>
        prev.map((it) => {
          if (it.id !== itemId) return it;
          // Reverse the flight
          const rest = BASKET_RESTS[it.restIndex % BASKET_RESTS.length];
          return {
            ...it,
            dir: -1,
            startTime: performance.now(),
            duration: FLIGHT_OUT_MS / motionMult,
            // fly back to the original origin
            origin: it.origin,
          };
        })
      );

      // Remove after flight completes
      setTimeout(() => {
        setItems((prev) => prev.filter((it) => it.id !== itemId));
      }, FLIGHT_OUT_MS / motionMult + 50);
    },
    [motionMult]
  );

  // Calculate totals
  const subtotal = items
    .filter((it) => it.dir === 1)
    .reduce((sum, it) => sum + (it.product.priceLow + it.product.priceHigh) / 2, 0);
  const fee = Math.round(subtotal * (markup - 1));
  const total = Math.round(subtotal + fee);
  const itemCount = items.filter((it) => it.dir === 1).length;

  // Count items per category
  const catCounts = {};
  items.forEach((it) => {
    if (it.dir === 1) {
      const cat = CATEGORIES.find((c) => c.products.some((p) => p.id === it.product.id));
      if (cat) catCounts[cat.id] = (catCounts[cat.id] || 0) + 1;
    }
  });

  return (
    <div className={`builder-grid hover-${hoverIntensity}`}>
      {/* Left panel — category accordion */}
      <div className="builder-controls">
        <div className="section-eyebrow" style={{ color: 'var(--gold-soft)' }}>
          BUILD YOUR OWN
        </div>
        <h2 className="section-title" style={{ color: 'var(--cream)', margin: '14px 0 12px' }}>
          Pick what <em>belongs</em>
          <br />
          in their story.
        </h2>
        <p className="builder-lede">
          Open a category. Tap a piece. Watch it land in the basket.
        </p>

        <div className="cat-list">
          {CATEGORIES.map((cat) => {
            const isOpen = openCat === cat.id;
            const count = catCounts[cat.id] || 0;
            return (
              <div key={cat.id} className={`cat-row ${isOpen ? 'open' : ''}`}>
                <button
                  className="cat-head"
                  onClick={() => setOpenCat(isOpen ? null : cat.id)}
                >
                  <span className="cat-thumb">
                    <img
                      src={cat.coverImg}
                      alt=""
                      onError={(e) => {
                        e.target.src = PLACEHOLDER(cat.label.split(' ')[0]);
                      }}
                    />
                  </span>
                  <span className="cat-label">{cat.label}</span>
                  {count > 0 && <span className="cat-count">{count}</span>}
                  <span className="cat-chev">{isOpen ? '\u2212' : '+'}</span>
                </button>
                <div
                  className="cat-panel"
                  style={{ maxHeight: isOpen ? cat.products.length * 88 + 16 : 0 }}
                >
                  {cat.products.map((p) => (
                    <button
                      key={p.id}
                      className="prod-row"
                      onClick={(e) => handleAddProduct(p, e)}
                    >
                      <span className="prod-thumb">
                        <img
                          src={p.img}
                          alt={p.name}
                          onError={(e) => {
                            e.target.src = PLACEHOLDER(p.brand);
                          }}
                        />
                      </span>
                      <span className="prod-meta">
                        <span className="prod-brand">{p.brand}</span>
                        <span className="prod-name">{p.name}</span>
                        <span className="prod-price-inline">
                          from{' '}
                          <b>
                            PKR {p.priceLow.toLocaleString()}&ndash;{p.priceHigh.toLocaleString()}
                          </b>
                        </span>
                      </span>
                      <span className="prod-add">&#xFF0B;</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right panel — basket stage + total */}
      <div className="builder-stage-col">
        <div className="builder-stage" ref={stageRef}>
          <div className="basket-floor-glow" />
          <div className="basket-3d" style={{ transform: 'rotateX(-2deg) rotateY(0deg)' }}>
            {/* Back layer (handle, back rim) */}
            <div className="basket-layer basket-layer-back">
              <GoldBasketBack />
            </div>

            {/* Flying / resting items */}
            {items.map((it) => {
              const rest = BASKET_RESTS[it.restIndex % BASKET_RESTS.length];
              const elapsed = now - it.startTime;
              const rawT = Math.max(0, Math.min(1, elapsed / it.duration));

              // Easing
              const ease = it.dir === 1 ? 1 - Math.pow(1 - rawT, 3) : Math.pow(rawT, 2);

              const from = it.dir === 1 ? it.origin : rest;
              const to = it.dir === 1 ? rest : it.origin;

              const peakX = ((from.x || 0) + (to.x || 0)) / 2;
              const peakY = Math.min(from.y || 0, to.y || 0) - 220;
              const peakZ = 240;

              const tx = arcLerp(from.x || 0, peakX, to.x || 0, ease);
              const ty = arcLerp(from.y || 0, peakY, to.y || 0, ease);
              const tz = arcLerp(0, peakZ, to.z || rest.z || 0, ease);
              const rx = (rest.rx || 0) * ease;
              const ry = (rest.ry || 0) * ease;
              const rz = (rest.rz || 0) * ease;
              const s = 0.3 + (rest.s || 1) * 0.7 * ease;

              const opacity = it.dir === 1 ? Math.min(1, rawT * 3) : 1 - rawT;
              const settled = it.dir === 1 && rawT >= 0.99;
              const shadowStrength = Math.max(0, (ease - 0.4) / 0.6);

              return (
                <div
                  key={it.id}
                  className="basket-item-3d builder-flying-item"
                  style={{
                    transform: `
                      translate3d(calc(${tx}px - 50%), calc(${ty}px - 50%), ${tz}px)
                      rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)
                      scale(${s})
                    `,
                    opacity,
                    width: 170,
                    height: 170,
                    zIndex: 10 + it.restIndex,
                    pointerEvents: settled ? 'auto' : 'none',
                    cursor: settled ? 'pointer' : 'default',
                    filter: `
                      drop-shadow(0 ${10 * s}px ${16 * s}px rgba(0,0,0,${0.45 * shadowStrength}))
                    `,
                  }}
                  onClick={() => settled && handleRemoveItem(it.id)}
                  title={settled ? `Click to remove ${it.product.name}` : ''}
                >
                  <img
                    className="flying-product-photo"
                    src={it.product.img}
                    alt={it.product.name}
                    onError={(e) => {
                      e.target.src = PLACEHOLDER(it.product.brand);
                    }}
                  />
                </div>
              );
            })}

            {/* Front layer (body, rim, bow) */}
            <div className="basket-layer basket-layer-front">
              <GoldBasketFront />
            </div>
          </div>

          {/* Empty hint */}
          {items.filter((it) => it.dir === 1).length === 0 && (
            <div className="basket-empty-hint">{emptyCopy}</div>
          )}
        </div>

        {/* Total card */}
        <div className={`basket-total-card total-${counterStyle}`}>
          <div className="total-rows">
            <div className="total-row">
              <span>ITEMS ({itemCount})</span>
              <span>PKR {Math.round(subtotal).toLocaleString()}</span>
            </div>
            <div className="total-row">
              <span>CURATION + RIBBON-TYING ({Math.round((markup - 1) * 100)}%)</span>
              <span>PKR {fee.toLocaleString()}</span>
            </div>
          </div>
          <div className="total-divider" />
          <div className="total-final">
            <div className="total-label">ESTIMATED TOTAL</div>
            <CasinoCounter value={total} style={counterStyle} />
          </div>
        </div>
      </div>
    </div>
  );
}
