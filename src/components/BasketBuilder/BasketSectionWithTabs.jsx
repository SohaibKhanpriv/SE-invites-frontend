import { useState } from 'react';
import { BasketSection as OriginalBasketSection } from '../BasketSection/BasketSection';
import { BasketBuilderScene } from './BasketBuilderScene';

const TABS = [
  { id: 'demo', num: '01', label: 'Watch the demo' },
  { id: 'build', num: '02', label: 'Build your own' },
];

export function BasketSectionWithTabs({ tweaks = {} }) {
  const [activeTab, setActiveTab] = useState('build');

  return (
    <div className="basket-section-shell">
      {/* Tab bar */}
      <div className="basket-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`basket-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-num">{tab.num}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'demo' ? (
        <OriginalBasketSection />
      ) : (
        <div style={{ padding: '0 0 100px' }}>
          <BasketBuilderScene tweaks={tweaks} />
        </div>
      )}
    </div>
  );
}
