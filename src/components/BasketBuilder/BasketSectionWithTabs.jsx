import { useState } from 'react';
import { BasketDemoScene } from '../ThreeBasketBuilder/BasketDemoScene';
import { ThreeBasketBuilder } from '../ThreeBasketBuilder/ThreeBasketBuilder';

const TABS = [
  { id: 'demo',  num: '01', label: 'Watch the demo' },
  { id: 'build', num: '02', label: 'Build your own' },
];

export function BasketSectionWithTabs({ tweaks = {} }) {
  const [activeTab, setActiveTab] = useState('build');

  return (
    <div className="basket-section-shell">
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

      {activeTab === 'demo' && <BasketDemoScene onBuildClick={() => setActiveTab('build')} />}
      {activeTab === 'build' && (
        <div style={{ padding: '0 0 100px' }}>
          <ThreeBasketBuilder tweaks={tweaks} />
        </div>
      )}
    </div>
  );
}
