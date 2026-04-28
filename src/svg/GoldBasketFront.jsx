export function GoldBasketFront() {
  return (
    <svg
      viewBox="0 0 600 460"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className="gold-basket-svg"
      style={{ pointerEvents: 'none' }}
    >
      <defs>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9a955" />
          <stop offset=".5" stopColor="#b78534" />
          <stop offset="1" stopColor="#5b3a14" />
        </linearGradient>
        <linearGradient id="weaveGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6b865" />
          <stop offset="1" stopColor="#7d5520" />
        </linearGradient>
        <linearGradient id="rimGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0d080" />
          <stop offset=".4" stopColor="#c9a24b" />
          <stop offset="1" stopColor="#6b4921" />
        </linearGradient>
        <radialGradient id="bodySheen" cx="50%" cy="15%" r="70%">
          <stop offset="0" stopColor="#fffbf0" stopOpacity=".25" />
          <stop offset="1" stopColor="#fffbf0" stopOpacity="0" />
        </radialGradient>
        <clipPath id="bodyClip">
          <path d="M 80 250 L 520 250 L 495 420 Q 300 455, 105 420 Z" />
        </clipPath>
      </defs>

      {/* Basket body */}
      <path
        d="M 80 250 L 520 250 L 495 420 Q 300 455, 105 420 Z"
        fill="url(#bodyGrad)"
        stroke="#3d2308"
        strokeWidth="2.5"
      />

      {/* Weave pattern — clipped to body */}
      <g clipPath="url(#bodyClip)">
        {/* Vertical staves */}
        {[...Array(22)].map((_, i) => {
          const x = 95 + i * 20;
          return (
            <path
              key={`v${i}`}
              d={`M ${x} 250 Q ${x + (i % 2 === 0 ? 3 : -3)} 340, ${x - 2} 430`}
              fill="none"
              stroke="#3d2308"
              strokeWidth="1.2"
              opacity=".55"
            />
          );
        })}

        {/* Horizontal weave rows */}
        {[0, 1, 2, 3, 4, 5, 6].map((row) => {
          const baseY = 262 + row * 22;
          const offset = row % 2 === 0 ? 0 : 10;
          return (
            <g key={`r${row}`}>
              {[...Array(20)].map((_, col) => {
                const x = 86 + offset + col * 22;
                return (
                  <rect
                    key={`w${row}-${col}`}
                    x={x}
                    y={baseY}
                    width="14"
                    height="9"
                    rx="1.5"
                    fill="url(#weaveGrad)"
                    stroke="#3d2308"
                    strokeWidth=".6"
                    opacity=".7"
                  />
                );
              })}
            </g>
          );
        })}
      </g>

      {/* Radial sheen overlay */}
      <path
        d="M 80 250 L 520 250 L 495 420 Q 300 455, 105 420 Z"
        fill="url(#bodySheen)"
      />

      {/* Body groove highlights */}
      <path d="M 90 280 Q 300 298, 510 280" fill="none" stroke="#e8c473" strokeWidth=".8" opacity=".4" />
      <path d="M 95 320 Q 300 338, 505 320" fill="none" stroke="#e8c473" strokeWidth=".8" opacity=".35" />
      <path d="M 100 360 Q 300 378, 500 360" fill="none" stroke="#e8c473" strokeWidth=".8" opacity=".3" />

      {/* Rim — 4 ellipses for depth */}
      <ellipse cx="300" cy="250" rx="232" ry="30" fill="#2a1508" />
      <ellipse cx="300" cy="250" rx="228" ry="28" fill="url(#rimGrad)" />
      <ellipse cx="300" cy="251" rx="222" ry="24" fill="#3d2308" opacity=".6" />
      <ellipse cx="300" cy="251" rx="216" ry="20" fill="#2a1508" opacity=".4" />

      {/* Rim braid texture — 36 gold dots */}
      {[...Array(36)].map((_, i) => {
        const t = i / 35;
        const angle = t * Math.PI;
        const x = 300 + Math.cos(angle) * 224;
        const y = 250 + Math.sin(angle) * 26;
        if (y < 250) return null;
        return (
          <ellipse
            key={`b${i}`}
            cx={x}
            cy={y}
            rx="3.5"
            ry="2"
            fill="#c9a24b"
            opacity=".65"
          />
        );
      })}

      {/* Blush ribbon bow at base */}
      <g transform="translate(300 432)">
        {/* Left loop */}
        <path
          d="M -8 0 Q -38 -20 -28 -4 Q -38 16 -8 0 Z"
          fill="#f4d4dc"
          stroke="#c98ea0"
          strokeWidth="1"
        />
        {/* Right loop */}
        <path
          d="M 8 0 Q 38 -20 28 -4 Q 38 16 8 0 Z"
          fill="#f4d4dc"
          stroke="#c98ea0"
          strokeWidth="1"
        />
        {/* Center knot */}
        <ellipse cx="0" cy="0" rx="6" ry="5" fill="#e8b8c0" stroke="#c98ea0" strokeWidth=".8" />
        {/* Trailing ends */}
        <path
          d="M -4 5 L -12 24 M 4 5 L 12 24"
          stroke="#f4d4dc"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
