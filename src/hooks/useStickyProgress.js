import { useState, useEffect } from 'react';

/**
 * For sticky sections: returns 0 -> 1 across the tall wrapper's scroll distance.
 * The wrapper should be much taller than the viewport; the sticky child stays
 * pinned while this value advances.
 */
export function useStickyProgress(ref) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      const scrolled = -rect.top;
      setProgress(Math.max(0, Math.min(1, scrolled / total)));
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref]);

  return progress;
}
