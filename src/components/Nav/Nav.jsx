import { useScrollY } from '../../hooks';

export function Nav() {
  const y = useScrollY();

  return (
    <nav className={`nav ${y > 60 ? 'scrolled' : ''}`}>
      <div className="nav-brand">
        <div className="nav-brand-mark">SE</div>
        <div className="nav-brand-name">SE &middot; INVITES</div>
      </div>
      <div className="nav-links">
        <a href="#trays">Ring Trays</a>
        <a href="#baskets">Gift Baskets</a>
        <a href="#invites">Invites</a>
        <a href="#favors">Favors</a>
        <a href="#catalogue">Catalogue</a>
      </div>
      <a className="nav-cta" href="#order">
        Order now
      </a>
    </nav>
  );
}
