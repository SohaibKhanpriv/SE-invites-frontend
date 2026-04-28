import { useMemo } from 'react';

const CELL_HEIGHTS = { cream: 38, velvet: 34, script: 34 };

/**
 * Slot-machine style counter for PKR totals.
 * Each digit rolls independently with a spring overshoot.
 *
 * @param {{ value: number, style?: 'cream' | 'velvet' | 'script' }} props
 */
export function CasinoCounter({ value, style = 'cream' }) {
  const cellH = CELL_HEIGHTS[style] || 38;

  // Pad to 6 digits, split into chars with comma separators
  const digits = useMemo(() => {
    const str = String(Math.round(value)).padStart(6, ' ');
    const result = [];
    const len = str.length;
    for (let i = 0; i < len; i++) {
      const ch = str[i];
      // Insert comma separator before groups of 3 from the right
      const fromRight = len - i;
      if (fromRight > 0 && fromRight % 3 === 0 && i > 0 && ch !== ' ') {
        result.push({ type: 'sep' });
      }
      result.push({ type: ch === ' ' ? 'blank' : 'digit', value: ch === ' ' ? 0 : parseInt(ch, 10) });
    }
    return result;
  }, [value]);

  return (
    <div className={`casino-counter casino-${style}`} style={{ '--cell-h': `${cellH}px` }}>
      <span className="casino-currency">&#8360;</span>
      {digits.map((d, i) =>
        d.type === 'sep' ? (
          <span key={`s${i}`} className="casino-sep">,</span>
        ) : d.type === 'blank' ? (
          <span key={`b${i}`} className="casino-cell casino-blank" />
        ) : (
          <span key={`d${i}`} className="casino-cell">
            <span
              className="casino-roll"
              style={{ transform: `translateY(-${d.value * cellH}px)` }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <span key={n} className="casino-digit">{n}</span>
              ))}
            </span>
          </span>
        )
      )}
    </div>
  );
}
