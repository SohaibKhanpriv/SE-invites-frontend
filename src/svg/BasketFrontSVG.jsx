export function BasketFrontSVG() {
  return (
    <svg
      viewBox="0 0 600 500"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <defs>
        <pattern id="weaveF" x="0" y="0" width="22" height="14" patternUnits="userSpaceOnUse">
          <rect width="22" height="14" fill="#a57a48" />
          <path d="M0 7 Q 5.5 -1, 11 7 Q 16.5 15, 22 7" fill="none" stroke="#6b4921" strokeWidth="1.8" />
          <path d="M0 7 Q 5.5 15, 11 7 Q 16.5 -1, 22 7" fill="none" stroke="#d3a56a" strokeWidth="1" />
          <path d="M0 3 Q 5.5 -1, 11 3" fill="none" stroke="#fff" strokeWidth=".5" opacity=".3" />
        </pattern>
        <pattern id="weaveF2" x="0" y="0" width="20" height="14" patternUnits="userSpaceOnUse">
          <rect width="20" height="14" fill="#8a6233" />
          <path d="M0 7 Q 5 0, 10 7 Q 15 14, 20 7" fill="none" stroke="#4d3218" strokeWidth="1.6" />
          <path d="M0 7 Q 5 14, 10 7 Q 15 0, 20 7" fill="none" stroke="#b88a54" strokeWidth="1" opacity=".7" />
        </pattern>
        <linearGradient id="rimFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e3ba7a" />
          <stop offset=".5" stopColor="#b58852" />
          <stop offset="1" stopColor="#6b4921" />
        </linearGradient>
        <linearGradient id="bodyShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(0,0,0,.25)" />
          <stop offset=".3" stopColor="rgba(0,0,0,0)" />
          <stop offset=".75" stopColor="rgba(0,0,0,0)" />
          <stop offset="1" stopColor="rgba(0,0,0,.45)" />
        </linearGradient>
        <filter id="bulbGlowF" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* front body */}
      <path d="M 58 252 L 542 252 L 520 440 Q 300 482, 80 440 Z" fill="url(#weaveF)" stroke="#4d3218" strokeWidth="3" />
      <path d="M 58 252 L 542 252 L 520 440 Q 300 482, 80 440 Z" fill="url(#bodyShade)" />

      {/* weave grooves */}
      <path d="M 70 280 Q 300 300, 530 280" fill="none" stroke="#6b4921" strokeWidth="1.5" opacity=".55" />
      <path d="M 75 320 Q 300 340, 525 320" fill="none" stroke="#6b4921" strokeWidth="1.5" opacity=".5" />
      <path d="M 80 365 Q 300 385, 520 365" fill="none" stroke="#6b4921" strokeWidth="1.5" opacity=".45" />
      <path d="M 85 405 Q 300 425, 515 405" fill="none" stroke="#6b4921" strokeWidth="1.5" opacity=".4" />
      {/* weave highlights */}
      <path d="M 72 275 Q 300 295, 528 275" fill="none" stroke="#e3ba7a" strokeWidth=".8" opacity=".5" />
      <path d="M 77 315 Q 300 335, 523 315" fill="none" stroke="#e3ba7a" strokeWidth=".8" opacity=".4" />

      {/* bottom band */}
      <path d="M 80 430 Q 300 470, 520 430 L 515 455 Q 300 495, 85 455 Z" fill="url(#weaveF2)" stroke="#3a2410" strokeWidth="2" />

      {/* front rim */}
      <path d="M 60 252 A 240 40 0 0 0 540 252 L 538 264 A 240 40 0 0 1 62 264 Z" fill="url(#rimFront)" stroke="#4d3218" strokeWidth="2" />

      {/* rim braid detail */}
      {[...Array(24)].map((_, i) => {
        const t = i / 23;
        const x = 64 + t * 472;
        const y = 252 + Math.sin(t * Math.PI) * 11;
        return (
          <path
            key={i}
            d={`M ${x - 3} ${y + 3} Q ${x} ${y - 2} ${x + 3} ${y + 3}`}
            fill="none"
            stroke="#3a2410"
            strokeWidth="1"
            opacity=".75"
          />
        );
      })}

      {/* string lights along rim */}
      {[...Array(16)].map((_, i) => {
        const t = i / 15;
        const x = 70 + t * 460;
        const y = 250 + Math.sin(t * Math.PI) * 12;
        return (
          <g key={i}>
            <line x1={x} y1={y - 22} x2={x} y2={y - 8} stroke="#6b4921" strokeWidth=".8" opacity=".8" />
            <circle cx={x} cy={y - 28} r="14" fill="#fff3a8" opacity=".18" filter="url(#bulbGlowF)" />
            <ellipse cx={x} cy={y - 26} rx="3.5" ry="5" fill="#fff6d4" />
            <ellipse cx={x} cy={y - 26} rx="3.5" ry="5" fill="#ffce6a" opacity=".55" />
            <animate attributeName="opacity" values=".85;1;.85" dur={`${1.4 + (i % 4) * 0.3}s`} repeatCount="indefinite" />
          </g>
        );
      })}

      {/* front ribbon drape */}
      <path d="M 90 438 Q 180 420 260 446 Q 340 472 430 448 Q 480 435 520 438" fill="none" stroke="#f0c7c5" strokeWidth="5" strokeLinecap="round" opacity=".9" />
      <path d="M 90 438 Q 180 420 260 446 Q 340 472 430 448 Q 480 435 520 438" fill="none" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity=".5" />

      {/* bow knot */}
      <g transform="translate(260 452)">
        <path d="M -20 0 Q -32 -12 -10 -4 Q -32 14 -20 0 Z" fill="#f0a7b5" stroke="#8a2538" strokeWidth=".8" />
        <path d="M 20 0 Q 32 -12 10 -4 Q 32 14 20 0 Z" fill="#f0a7b5" stroke="#8a2538" strokeWidth=".8" />
        <circle r="5" fill="#c97a8a" />
        <path d="M -4 6 L -8 22 M 4 6 L 8 22" stroke="#f0a7b5" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}
