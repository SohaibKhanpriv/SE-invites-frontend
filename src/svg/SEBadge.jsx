import { SELogoMark } from './SELogoMark';

export function SEBadge({ size = 240, showTag = true }) {
  return (
    <div className="hex-badge" style={{ width: size, height: size }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <SELogoMark size={size * 0.48} />
        <div
          style={{
            fontFamily: '"Cormorant SC", serif',
            letterSpacing: '0.38em',
            fontSize: size * 0.055,
            color: 'var(--maroon)',
            marginTop: -size * 0.02,
          }}
        >
          INVITES
        </div>
        {showTag && (
          <>
            <div
              style={{
                width: size * 0.45,
                height: 1,
                background: 'var(--gold)',
                opacity: 0.5,
                margin: `${size * 0.015}px 0`,
              }}
            />
            <div
              style={{
                fontFamily: '"Pinyon Script", cursive',
                fontSize: size * 0.082,
                color: 'var(--maroon-deep)',
                lineHeight: 1,
                whiteSpace: 'nowrap',
              }}
            >
              Curating your special moments
            </div>
          </>
        )}
      </div>
    </div>
  );
}
