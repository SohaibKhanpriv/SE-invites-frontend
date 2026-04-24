import { useRef } from 'react';
import { useScrollY } from '../../hooks';
import { SEBadge } from '../../svg';
import { FloatImg } from './FloatImg';

const PETALS = [
  { l: '8%', t: '20%', r: -30, s: 1.4, c: 'var(--maroon)' },
  { l: '88%', t: '15%', r: 40, s: 1.1, c: 'var(--rose)' },
  { l: '12%', t: '70%', r: 18, s: 1.6, c: 'var(--dust)' },
  { l: '84%', t: '74%', r: -22, s: 1.2, c: 'var(--maroon-deep)' },
  { l: '20%', t: '48%', r: 60, s: 0.8, c: 'var(--rose)' },
  { l: '78%', t: '48%', r: -45, s: 0.9, c: 'var(--dust)' },
];

export function Hero() {
  const y = useScrollY();
  const heroRef = useRef(null);
  const pf = Math.min(y, 900);

  const tiltY = pf * 0.08;
  const tiltX = -pf * 0.03;
  const scale = 1 - Math.min(pf / 2000, 0.15);

  return (
    <section className="hero" ref={heroRef}>
      {/* ambient stage */}
      <div className="hero-stage">
        {/* petals */}
        {PETALS.map((p, i) => (
          <div
            key={i}
            className="petal"
            style={{
              left: p.l,
              top: p.t,
              transform: `rotate(${p.r + pf * 0.08}deg) scale(${p.s}) translateY(${pf * 0.15}px)`,
              background: p.c,
              animation: `petalFloat ${6 + i}s ease-in-out ${i * 0.4}s infinite`,
            }}
          />
        ))}

        {/* string lights */}
        <div className="lights-row" style={{ top: 90 }}>
          {[...Array(28)].map((_, i) => {
            const t = i / 27;
            const droop = Math.sin(t * Math.PI) * 34;
            return (
              <div
                key={i}
                className="light-bulb"
                style={{
                  left: `${t * 100}%`,
                  top: 20 + droop,
                  animationDelay: `${(i % 5) * 0.3}s`,
                }}
              />
            );
          })}
        </div>

        {/* floating product images */}
        <FloatImg
          src="/assets/ring-tray-floral.png"
          style={{ left: '4%', top: '52%', width: 280, transform: `translateY(${pf * 0.4}px) rotate(-12deg)` }}
        />
        <FloatImg
          src="/assets/bouquet-pink.png"
          style={{ right: '2%', top: '22%', width: 220, transform: `translateY(${pf * 0.3}px) rotate(14deg)` }}
        />
        <FloatImg
          src="/assets/envelope.png"
          style={{ left: '6%', top: '18%', width: 200, transform: `translateY(${pf * 0.25}px) rotate(-8deg)` }}
        />
        <FloatImg
          src="/assets/box-red.png"
          style={{ right: '5%', top: '60%', width: 240, transform: `translateY(${pf * 0.5}px) rotate(10deg)` }}
        />
      </div>

      <div className="hero-inner" style={{ transform: `translateY(${pf * 0.2}px)` }}>
        <div className="hero-eyebrow">EST. EVERY LITTLE DETAIL</div>

        {/* Center SE badge with scroll-driven 3D tilt */}
        <div
          style={{
            display: 'grid',
            placeItems: 'center',
            perspective: '1000px',
            margin: '0 auto 24px',
            width: 'fit-content',
          }}
        >
          <div
            style={{
              transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`,
              transformStyle: 'preserve-3d',
              transition: 'transform .1s linear',
            }}
          >
            <SEBadge size={260} />
          </div>
        </div>

        <h1 className="hero-title">
          Curating
          <span className="script">your special</span>
          moments.
        </h1>
        <p className="hero-sub">
          Custom e-invites, heirloom ring trays, nikkah trays, sweet-boxes and
          hand-assembled gift baskets &mdash; made in small batches for the moments that matter.
        </p>
        <div className="hero-ctas">
          <a className="btn btn-primary" href="#order">
            Start your order
            <span>&rarr;</span>
          </a>
          <a className="btn btn-ghost" href="#catalogue">
            View catalogue
          </a>
        </div>

        {/* scroll hint */}
        <div
          style={{
            marginTop: 60,
            opacity: 0.6,
            fontFamily: '"Cormorant SC", serif',
            fontSize: 11,
            letterSpacing: '.3em',
            color: 'var(--maroon)',
          }}
        >
          SCROLL TO EXPLORE
          <div style={{ marginTop: 10, fontSize: 14 }}>&darr;</div>
        </div>
      </div>
    </section>
  );
}
