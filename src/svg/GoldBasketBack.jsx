export function GoldBasketBack() {
  return (
    <svg
      viewBox="0 0 600 460"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className="gold-basket-svg"
    >
      <defs>
        <linearGradient id="handleGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8c473" />
          <stop offset=".5" stopColor="#b8893a" />
          <stop offset="1" stopColor="#8a601f" />
        </linearGradient>
        <radialGradient id="innerWell" cx="50%" cy="0%" r="90%">
          <stop offset="0" stopColor="#1a0a04" />
          <stop offset=".6" stopColor="#0c0502" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
      </defs>

      {/* Handle — dark outline */}
      <path
        d="M 175 250 C 175 80, 425 80, 425 250"
        fill="none"
        stroke="#5b3a14"
        strokeWidth="22"
        strokeLinecap="round"
      />
      {/* Handle — gold fill */}
      <path
        d="M 175 250 C 175 80, 425 80, 425 250"
        fill="none"
        stroke="url(#handleGrad)"
        strokeWidth="16"
        strokeLinecap="round"
      />
      {/* Handle — white highlight */}
      <path
        d="M 180 245 C 180 90, 420 90, 420 245"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".25"
      />

      {/* Handle weave wraps */}
      {[...Array(14)].map((_, i) => {
        const t = (i + 1) / 15;
        const x = 175 + t * 250;
        const y = 250 - Math.sin(t * Math.PI) * 165;
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx="3"
            ry="7"
            fill="#5b3a14"
            opacity=".6"
            transform={`rotate(${(t - 0.5) * 80} ${x} ${y})`}
          />
        );
      })}

      {/* Silk ribbon wrap on handle */}
      <path
        d="M 195 210 Q 215 190 235 208 Q 260 225 280 206 Q 305 188 325 208 Q 350 225 370 206 Q 395 190 405 210"
        fill="none"
        stroke="#f4d4dc"
        strokeWidth="6"
        strokeLinecap="round"
        opacity=".8"
      />

      {/* Back rim (dark, so items read as "behind") */}
      <ellipse cx="300" cy="250" rx="220" ry="34" fill="url(#innerWell)" />
      <path
        d="M 80 250 A 220 34 0 0 1 520 250"
        fill="none"
        stroke="#3d2308"
        strokeWidth="6"
        opacity=".8"
      />
    </svg>
  );
}
