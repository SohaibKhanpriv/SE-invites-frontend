import { useScrollProgress } from '../../hooks';

export function ScrollProgress() {
  const progress = useScrollProgress();

  return <div className="scroll-progress" style={{ width: `${progress * 100}%` }} />;
}
