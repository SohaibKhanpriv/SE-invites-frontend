import { useState, useEffect } from 'react';

/**
 * Returns 0 -> 1 as the referenced element scrolls through the viewport.
 * 0 = element just entered from below, 1 = element has left the top.
 */
export function useSectionProgress(ref) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const scrolled = vh - rect.top;
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
