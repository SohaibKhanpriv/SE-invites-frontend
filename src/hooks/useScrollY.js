import { useState, useEffect } from 'react';

export function useScrollY() {
  const [y, setY] = useState(0);

  useEffect(() => {
    const handler = () => setY(window.scrollY);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return y;
}
