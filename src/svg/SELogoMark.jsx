export function SELogoMark({ size = 120 }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="seGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7a2432" />
          <stop offset="1" stopColor="#4a141c" />
        </linearGradient>
      </defs>
      {/* S shape */}
      <path
        d="M 70 45 C 40 45, 30 70, 50 88 L 95 108 C 115 117, 110 138, 85 138 L 55 138"
        fill="none"
        stroke="url(#seGrad)"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* E shape */}
      <path
        d="M 150 50 L 110 50 L 110 100 L 145 100 M 110 100 L 110 150 L 150 150"
        fill="none"
        stroke="url(#seGrad)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
