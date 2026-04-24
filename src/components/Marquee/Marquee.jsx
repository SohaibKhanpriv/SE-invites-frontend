import { Fragment } from 'react';
import { MARQUEE_ITEMS } from '../../config/marqueeItems';

export function Marquee() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="marquee">
      <div className="marquee-track">
        {doubled.map((text, i) => (
          <Fragment key={i}>
            <span>{text}</span>
            <span className="dot">&starf;</span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
