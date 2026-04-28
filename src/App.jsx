import { useEffect, useState, useCallback } from 'react';

import { ScrollProgress } from './components/ScrollProgress/ScrollProgress';
import { Nav } from './components/Nav/Nav';
import { Hero } from './components/Hero/Hero';
import { Marquee } from './components/Marquee/Marquee';
import { TraysSection } from './components/TraysSection/TraysSection';
import { BasketSectionWithTabs } from './components/BasketBuilder/BasketSectionWithTabs';
import { InvitesSection } from './components/InvitesSection/InvitesSection';
import { FavorsSection } from './components/FavorsSection/FavorsSection';
import { CatalogueSection } from './components/CatalogueSection/CatalogueSection';
import { CTASection } from './components/CTASection/CTASection';
import { Footer } from './components/Footer/Footer';

const THEME_DEFAULTS = {
  palette: 'maroon',
  typeVoice: 'script',
  motion: 'flowing',
};

export default function App() {
  const [theme, setTheme] = useState(THEME_DEFAULTS);

  const updateTheme = useCallback((key, value) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
  }, []);

  // sync data attributes to body for CSS theming
  useEffect(() => {
    document.body.dataset.palette = theme.palette;
    document.body.dataset.type = theme.typeVoice;
    document.body.dataset.motion = theme.motion;
  }, [theme.palette, theme.typeVoice, theme.motion]);

  return (
    <>
      <ScrollProgress />
      <Nav />
      <Hero />
      <Marquee />
      <TraysSection />
      <BasketSectionWithTabs tweaks={theme} />
      <InvitesSection />
      <FavorsSection />
      <CatalogueSection />
      <CTASection />
      <Footer />
    </>
  );
}
