/* ── Gift basket item SVG components ── */

export function SuitFabricSVG() {
  return (
    <svg viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="suitA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c32d45" />
          <stop offset=".55" stopColor="#7a1a2c" />
          <stop offset="1" stopColor="#3a0b14" />
        </linearGradient>
        <linearGradient id="suitB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0c478" />
          <stop offset="1" stopColor="#8a5a1a" />
        </linearGradient>
        <linearGradient id="suitC" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2d8c0" />
          <stop offset="1" stopColor="#a87456" />
        </linearGradient>
        <pattern id="embA" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="2.2" fill="none" stroke="#f0d78c" strokeWidth=".8" />
          <circle cx="10" cy="10" r="4.5" fill="none" stroke="#f0d78c" strokeWidth=".4" opacity=".6" />
          <path d="M10 4 L10 2 M10 18 L10 16 M4 10 L2 10 M18 10 L16 10" stroke="#f0d78c" strokeWidth=".6" />
        </pattern>
        <filter id="softShade"><feGaussianBlur stdDeviation=".6" /></filter>
      </defs>
      <g transform="translate(10 108) skewX(-4)">
        <path d="M0 0 L220 0 L215 62 Q110 72 5 62 Z" fill="url(#suitC)" />
        <path d="M0 0 L220 0 L220 6 L0 6 Z" fill="#fff" opacity=".3" />
        <path d="M18 58 L202 58" stroke="#6b4921" strokeWidth=".8" opacity=".4" />
      </g>
      <g transform="translate(14 70) skewX(-3)">
        <path d="M0 0 L212 0 L208 50 Q106 58 4 50 Z" fill="url(#suitB)" />
        <path d="M0 0 L212 0 L212 5 L0 5 Z" fill="#fff" opacity=".4" />
        <path d="M10 10 h190 M10 20 h190 M10 30 h190" stroke="#8a5a1a" strokeWidth=".5" opacity=".3" />
      </g>
      <g transform="translate(20 32) skewX(-2)">
        <path d="M0 0 L200 0 L196 48 Q100 56 4 48 Z" fill="url(#suitA)" />
        <path d="M0 0 L200 0 L200 48 Q100 56 0 48 Z" fill="url(#embA)" opacity=".55" />
        <path d="M0 0 L200 0 L200 6 L0 6 Z" fill="#fff" opacity=".18" />
        <path d="M6 44 Q100 50 194 44" fill="none" stroke="#f0d78c" strokeWidth="1.2" />
        <path d="M6 6 Q100 2 194 6" fill="none" stroke="#f0d78c" strokeWidth=".8" opacity=".7" />
      </g>
      <ellipse cx="120" cy="180" rx="108" ry="6" fill="rgba(0,0,0,.35)" filter="url(#softShade)" />
    </svg>
  );
}

export function BanglesSVG() {
  return (
    <svg viewBox="0 0 220 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="bAu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff4c2" />
          <stop offset=".3" stopColor="#f0c860" />
          <stop offset=".6" stopColor="#b88320" />
          <stop offset="1" stopColor="#5a3c0f" />
        </linearGradient>
        <linearGradient id="bAuDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b88320" />
          <stop offset="1" stopColor="#4a310d" />
        </linearGradient>
      </defs>
      <ellipse cx="110" cy="186" rx="95" ry="6" fill="rgba(0,0,0,.4)" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const y = 50 + i * 15;
        return (
          <g key={i}>
            <path d={`M 20 ${y} A 90 14 0 0 1 200 ${y}`} fill="none" stroke="url(#bAuDark)" strokeWidth="4" />
            <path d={`M 20 ${y} A 90 14 0 0 0 200 ${y}`} fill="none" stroke="url(#bAu)" strokeWidth="5.5" />
            <path d={`M 30 ${y - 1} A 80 8 0 0 0 190 ${y - 1}`} fill="none" stroke="#fff7d9" strokeWidth=".9" opacity=".7" />
            {i % 2 === 0 &&
              [0.3, 0.5, 0.7].map((t, j) => {
                const jx = 20 + 180 * t;
                const jy = y + Math.sin(t * Math.PI) * 12 - 2;
                return <circle key={j} cx={jx} cy={jy} r="1.6" fill="#ffe4a6" />;
              })}
          </g>
        );
      })}
    </svg>
  );
}

export function PerfumeSVG() {
  return (
    <svg viewBox="0 0 180 220" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="liqP" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6c3c9" />
          <stop offset=".5" stopColor="#c64c5c" />
          <stop offset="1" stopColor="#5a1520" />
        </linearGradient>
        <linearGradient id="capP" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fce28a" />
          <stop offset=".5" stopColor="#c9a24b" />
          <stop offset="1" stopColor="#6b4a16" />
        </linearGradient>
        <linearGradient id="glassP" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity=".6" />
          <stop offset=".4" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity=".12" />
        </linearGradient>
      </defs>
      <ellipse cx="90" cy="208" rx="55" ry="5" fill="rgba(0,0,0,.45)" />
      <rect x="64" y="12" width="52" height="40" rx="5" fill="url(#capP)" stroke="#6b4a16" strokeWidth="1" />
      <rect x="66" y="14" width="48" height="10" rx="3" fill="#fff5c7" opacity=".75" />
      <rect x="72" y="46" width="36" height="3" rx="1" fill="#6b4a16" opacity=".7" />
      <rect x="76" y="52" width="28" height="18" fill="#d9b865" stroke="#6b4a16" strokeWidth="1" />
      <path d="M 70 70 L 110 70 L 116 82 L 64 82 Z" fill="#c9a24b" stroke="#6b4a16" strokeWidth="1" />
      <path d="M 52 82 Q 48 90 48 104 L 48 188 Q 48 200 60 200 L 120 200 Q 132 200 132 188 L 132 104 Q 132 90 128 82 Z" fill="url(#liqP)" stroke="#3a0b14" strokeWidth="1.6" />
      <path d="M 52 82 Q 48 90 48 104 L 48 188 Q 48 200 60 200 L 120 200 Q 132 200 132 188 L 132 104 Q 132 90 128 82 Z" fill="url(#glassP)" />
      <path d="M 50 130 Q 90 126 130 130" stroke="#fff" strokeWidth=".8" opacity=".45" />
      <rect x="62" y="138" width="56" height="48" rx="2" fill="#fdf8ef" opacity=".94" stroke="#6b4a16" strokeWidth=".6" />
      <text x="90" y="154" textAnchor="middle" fontFamily="Cormorant SC, serif" fontSize="9" fill="#6b1f2a" letterSpacing="3">S E</text>
      <line x1="72" y1="158" x2="108" y2="158" stroke="#6b1f2a" strokeWidth=".4" />
      <text x="90" y="174" textAnchor="middle" fontFamily="Pinyon Script, cursive" fontSize="14" fill="#6b1f2a">parfum</text>
      <text x="90" y="182" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="4.5" fill="#6b1f2a" letterSpacing="1.5">EAU DE TOILETTE · 50ML</text>
      <path d="M 52 86 L 52 180" stroke="#fff" strokeWidth="1.2" opacity=".5" />
    </svg>
  );
}

export function BouquetSVG() {
  return (
    <svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="roseG" cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".3" stopColor="#f0b0bc" />
          <stop offset="1" stopColor="#8a2538" />
        </radialGradient>
        <linearGradient id="wrapG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6c7d0" />
          <stop offset="1" stopColor="#b8697e" />
        </linearGradient>
        <linearGradient id="leafG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6a8a3e" />
          <stop offset="1" stopColor="#304518" />
        </linearGradient>
      </defs>
      <ellipse cx="110" cy="208" rx="70" ry="5" fill="rgba(0,0,0,.4)" />
      <path d="M 50 80 Q 35 60 30 30 Q 45 50 58 72" fill="url(#leafG)" />
      <path d="M 170 80 Q 185 60 190 30 Q 175 50 162 72" fill="url(#leafG)" />
      <path d="M 110 40 Q 100 20 90 5 Q 105 15 115 30" fill="url(#leafG)" opacity=".9" />
      {[
        { x: 75, y: 72, r: 20, c: '#8a2538' },
        { x: 110, y: 60, r: 24, c: '#c24f64' },
        { x: 145, y: 72, r: 20, c: '#e6a0b0' },
        { x: 90, y: 98, r: 18, c: '#d06678' },
        { x: 130, y: 98, r: 18, c: '#9a2a3c' },
        { x: 110, y: 108, r: 14, c: '#f0b0bc' },
      ].map((rose, i) => (
        <g key={i}>
          <circle cx={rose.x} cy={rose.y} r={rose.r} fill={rose.c} />
          <circle cx={rose.x} cy={rose.y} r={rose.r} fill="url(#roseG)" opacity=".8" />
          <circle cx={rose.x - 2} cy={rose.y - 3} r={rose.r * 0.6} fill="none" stroke="#fff" strokeWidth=".8" opacity=".4" />
          <circle cx={rose.x} cy={rose.y - 1} r={rose.r * 0.35} fill="none" stroke="#5a1520" strokeWidth=".6" opacity=".5" />
          <circle cx={rose.x} cy={rose.y} r={rose.r * 0.12} fill="#fce28a" opacity=".9" />
        </g>
      ))}
      <path d="M 50 130 L 170 130 L 140 205 L 80 205 Z" fill="url(#wrapG)" stroke="#8a2538" strokeWidth="1" />
      <path d="M 55 134 L 105 205" stroke="#fff" strokeWidth=".8" opacity=".5" />
      <path d="M 110 134 L 110 205" stroke="#fff" strokeWidth=".4" opacity=".35" />
      <path d="M 165 134 L 115 205" stroke="#fff" strokeWidth=".8" opacity=".4" />
      <path d="M 55 134 L 60 142 L 50 130 Z" fill="#fff" opacity=".55" />
      <g transform="translate(110 138)">
        <path d="M -16 0 Q -26 -10 -22 -2 Q -26 8 -14 2 Z" fill="#f0d78c" stroke="#8a6b2e" strokeWidth=".6" />
        <path d="M 16 0 Q 26 -10 22 -2 Q 26 8 14 2 Z" fill="#f0d78c" stroke="#8a6b2e" strokeWidth=".6" />
        <circle r="4" fill="#c9a24b" />
        <path d="M -4 5 L -10 22 M 4 5 L 10 22" stroke="#c9a24b" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function PlushSVG() {
  return (
    <svg viewBox="0 0 220 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="furG" cx="50%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".7" stopColor="#fdf8ef" />
          <stop offset="1" stopColor="#d8c7a8" />
        </radialGradient>
      </defs>
      <ellipse cx="110" cy="192" rx="78" ry="6" fill="rgba(0,0,0,.4)" />
      <path d="M 50 95 L 28 38 L 88 70 Z" fill="url(#furG)" stroke="#4a141c" strokeWidth="1.4" />
      <path d="M 170 95 L 192 38 L 132 70 Z" fill="url(#furG)" stroke="#4a141c" strokeWidth="1.4" />
      <path d="M 52 80 L 42 52 L 75 68 Z" fill="#f4b7bf" />
      <path d="M 168 80 L 178 52 L 145 68 Z" fill="#f4b7bf" />
      <ellipse cx="110" cy="115" rx="82" ry="68" fill="url(#furG)" stroke="#4a141c" strokeWidth="1.6" />
      <ellipse cx="68" cy="128" rx="10" ry="6" fill="#f4b7bf" opacity=".7" />
      <ellipse cx="152" cy="128" rx="10" ry="6" fill="#f4b7bf" opacity=".7" />
      <ellipse cx="82" cy="112" rx="4.5" ry="7" fill="#1a0b0d" />
      <ellipse cx="138" cy="112" rx="4.5" ry="7" fill="#1a0b0d" />
      <ellipse cx="83" cy="108" rx="1.4" ry="2" fill="#fff" />
      <ellipse cx="139" cy="108" rx="1.4" ry="2" fill="#fff" />
      <ellipse cx="110" cy="128" rx="5" ry="3.5" fill="#f6c96a" />
      <path d="M 48 132 L 82 134 M 48 140 L 82 140 M 48 148 L 82 146 M 172 132 L 138 134 M 172 140 L 138 140 M 172 148 L 138 146" stroke="#4a141c" strokeWidth="1" strokeLinecap="round" />
      <g transform="translate(155 62)">
        <path d="M -18 0 Q -24 -14 0 -6 Q -24 10 -18 0 Z" fill="#c64c5c" stroke="#6b1f2a" strokeWidth=".8" />
        <path d="M 18 0 Q 24 -14 0 -6 Q 24 10 18 0 Z" fill="#c64c5c" stroke="#6b1f2a" strokeWidth=".8" />
        <circle r="5" fill="#8a2538" />
        <circle r="2" cx="-1" cy="-1" fill="#f4b7bf" />
      </g>
    </svg>
  );
}

export function RibbonLightsSVG() {
  return (
    <svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <filter id="bulbBloom" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <path d="M 6 30 Q 60 80, 120 30 T 234 30" fill="none" stroke="#8a2538" strokeWidth="14" strokeLinecap="round" />
      <path d="M 6 30 Q 60 80, 120 30 T 234 30" fill="none" stroke="#f0a7b5" strokeWidth="5" strokeLinecap="round" opacity=".7" />
      <path d="M 10 32 Q 62 76, 120 34 T 228 32" fill="none" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity=".4" />
      <path d="M 4 105 Q 60 140, 120 105 T 236 105" fill="none" stroke="#4a3518" strokeWidth="1.2" />
      {[...Array(11)].map((_, i) => {
        const t = i / 10;
        const x = 4 + t * 232;
        const y = 105 + Math.sin(t * Math.PI) * 22;
        return (
          <g key={i}>
            <circle cx={x} cy={y + 12} r="12" fill="#fff3a8" opacity=".35" filter="url(#bulbBloom)" />
            <rect x={x - 2.2} y={y - 2} width="4.4" height="5" fill="#6b4a16" />
            <ellipse cx={x} cy={y + 5} rx="4.5" ry="6" fill="#fff6d4" />
            <ellipse cx={x} cy={y + 5} rx="4.5" ry="6" fill="#ffce6a" opacity=".6" />
            <ellipse cx={x - 1.5} cy={y + 3} rx="1.3" ry="2" fill="#fff" opacity=".8" />
          </g>
        );
      })}
      <g transform="translate(24 32)">
        <path d="M -18 0 Q -28 -14 0 -4 Q -28 14 -18 0 Z" fill="#8a2538" stroke="#3a0b14" strokeWidth=".8" />
        <path d="M 18 0 Q 28 -14 0 -4 Q 28 14 18 0 Z" fill="#8a2538" stroke="#3a0b14" strokeWidth=".8" />
        <circle r="5" fill="#5a1520" />
      </g>
    </svg>
  );
}
