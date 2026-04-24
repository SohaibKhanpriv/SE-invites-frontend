export function BasketBackSVG() {
  return (
    <svg
      viewBox="0 0 600 500"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        inset: 0,
        filter: 'drop-shadow(0 50px 70px rgba(0,0,0,.55))',
      }}
    >
      <defs>
        <radialGradient id="inner" cx="50%" cy="0%" r="90%">
          <stop offset="0" stopColor="#1a0a04" />
          <stop offset=".6" stopColor="#0c0502" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <linearGradient id="rimTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d3a56a" />
          <stop offset="1" stopColor="#8a6233" />
        </linearGradient>
      </defs>

      {/* handle */}
      <g>
        <path
          d="M 120 238 C 120 70, 480 70, 480 238"
          fill="none"
          stroke="#3e2810"
          strokeWidth="22"
          strokeLinecap="round"
        />
        <path
          d="M 120 238 C 120 70, 480 70, 480 238"
          fill="none"
          stroke="#8a6233"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M 125 230 C 125 85, 475 85, 475 230"
          fill="none"
          stroke="#d3a56a"
          strokeWidth="3"
          strokeLinecap="round"
          opacity=".6"
        />
        {/* handle weave detail */}
        {[...Array(18)].map((_, i) => {
          const t = i / 17;
          const x = 120 + t * 360;
          const y = 238 - Math.sin(t * Math.PI) * 155;
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="3"
              ry="8"
              fill="#6b4921"
              opacity=".7"
              transform={`rotate(${(t - 0.5) * 90} ${x} ${y})`}
            />
          );
        })}
        {/* silk wrap */}
        <path
          d="M 140 195 Q 160 175 180 190 Q 205 205 225 188 Q 250 170 275 188 Q 300 205 325 188 Q 350 170 375 188 Q 400 205 420 188 Q 440 175 460 195"
          fill="none"
          stroke="#f0c7c5"
          strokeWidth="7"
          strokeLinecap="round"
          opacity=".85"
        />
        <path
          d="M 140 195 Q 160 175 180 190 Q 205 205 225 188 Q 250 170 275 188 Q 300 205 325 188 Q 350 170 375 188 Q 400 205 420 188 Q 440 175 460 195"
          fill="none"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity=".5"
        />
      </g>

      {/* back rim */}
      <path d="M 60 250 A 240 40 0 0 1 540 250" fill="none" stroke="url(#rimTop)" strokeWidth="10" />
      {/* inside well */}
      <ellipse cx="300" cy="252" rx="236" ry="34" fill="url(#inner)" />
      {/* inner shadow */}
      <path d="M 72 252 A 228 28 0 0 1 528 252" fill="none" stroke="#000" strokeWidth="8" opacity=".6" />
      <path d="M 90 262 A 210 20 0 0 1 510 262" fill="none" stroke="#3a1c0b" strokeWidth="2" opacity=".8" />
    </svg>
  );
}
