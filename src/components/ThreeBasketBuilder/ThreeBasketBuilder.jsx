import { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { CATEGORIES } from '../../config/builderProducts';
import { CasinoCounter } from '../BasketBuilder/CasinoCounter';
import {
  initScene,
  buildBasketMesh,
  buildGridHelper,
  startFlyIn,
  startFlyOut,
  startBasketMorph,
} from './ThreeBasketScene';
import { createProductMesh } from './ThreeProductArchetypes';
import {
  BASKET_TIERS,
  TIER_ORDER,
  nextTier,
  calculateSlotPositions,
  reassignSlots,
  getCellSize,
  getInteriorHeight,
  getItemY,
  getItemTilt,
} from './ThreeBasketGrid';

const PLACEHOLDER = (name) =>
  `https://placehold.co/200x200/f6ecdf/6b1f2a?text=${encodeURIComponent(name)}`;

export function ThreeBasketBuilder({ tweaks = {} }) {
  const { markup = 1.1, counterStyle = 'cream' } = tweaks;

  const mountRef   = useRef(null);
  const sceneRef   = useRef(null);   // { renderer, scene, camera, basketGroup }
  const slotsRef   = useRef([]);     // slot objects for current tier
  const meshesRef  = useRef({});     // itemId → THREE.Group

  const [tierKey, setTierKey]         = useState('S');
  const [style,   setStyle]           = useState('crate');
  // items: [{ id, product, rotY, jitterX, jitterZ }]
  const [items,   setItems]           = useState([]);
  const [openCat, setOpenCat]         = useState('suits');
  const [upgradeModal, setUpgradeModal] = useState(null);

  // ── Scene init ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const container = mountRef.current;
    if (!container || sceneRef.current) return;

    const ctx = initScene(container);
    sceneRef.current = ctx;

    rebuildBasketMesh(ctx.basketGroup, tierKey, style);
    slotsRef.current = calculateSlotPositions(tierKey);

    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      ctx.renderer.render(ctx.scene, ctx.camera);
    };
    animate();

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      ctx.camera.aspect = w / h;
      ctx.camera.updateProjectionMatrix();
      ctx.renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      ctx.renderer.dispose();
      if (container.contains(ctx.renderer.domElement)) {
        container.removeChild(ctx.renderer.domElement);
      }
      sceneRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Rebuild basket when tier or style changes ──────────────────────────────
  useEffect(() => {
    const ctx = sceneRef.current;
    if (!ctx) return;

    rebuildBasketMesh(ctx.basketGroup, tierKey, style);
    slotsRef.current = calculateSlotPositions(tierKey);

    // Re-sort and reposition all existing items
    if (items.length > 0) {
      const assignments = reassignSlots(items, slotsRef.current, tierKey);
      const tier = BASKET_TIERS[tierKey];
      items.forEach((item) => {
        const mesh = meshesRef.current[item.id];
        const slot = assignments[item.id];
        if (mesh && slot) {
          applyItemTransform(mesh, slot, item, tier);
        }
      });
    }
  }, [tierKey, style]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Add product ────────────────────────────────────────────────────────────
  const handleAddProduct = useCallback((product, e) => {
    const ctx = sceneRef.current;
    if (!ctx) return;

    const tier = BASKET_TIERS[tierKey];

    if (items.length >= tier.maxSlots) {
      const next = nextTier(tierKey);
      if (next) setUpgradeModal({ pendingProduct: product, nextTierKey: next });
      return;
    }

    const cellSize      = getCellSize(tierKey);
    const interiorHeight = getInteriorHeight(tierKey);

    // Item record — jitter & rotation are permanent for this item
    const itemId = `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newItem = {
      id:      itemId,
      product,
      rotY:    (Math.random() - 0.5) * 0.18,
      jitterX: (Math.random() - 0.5) * cellSize * 0.05,
      jitterZ: (Math.random() - 0.5) * cellSize * 0.05,
    };

    // Create & add mesh (invisible until fly-in starts)
    const mesh = createProductMesh(product, cellSize, interiorHeight);
    mesh.visible = false;
    ctx.basketGroup.add(mesh);
    meshesRef.current[itemId] = mesh;

    const newItems   = [...items, newItem];
    const assignments = reassignSlots(newItems, slotsRef.current, tierKey);

    // Snap existing items to their (possibly re-sorted) slots instantly
    items.forEach((item) => {
      const existingMesh = meshesRef.current[item.id];
      const slot         = assignments[item.id];
      if (existingMesh && slot) applyItemTransform(existingMesh, slot, item, tier);
    });

    // Fly-in new item
    mesh.visible = true;
    const newSlot   = assignments[itemId];
    const landingPos = computeLandingPos(newSlot, newItem, tier);
    const origin    = getClickOriginWorld(e, ctx, mountRef.current);

    startFlyIn(mesh, origin, landingPos, tier.h, newItem.rotY, () => {
      // Apply full transform (tilt, clamp) once landed
      applyItemTransform(mesh, newSlot, newItem, tier);
    });

    setItems(newItems);
  }, [tierKey, items]);

  // ── Remove product ─────────────────────────────────────────────────────────
  const handleRemoveItem = useCallback((itemId) => {
    const ctx  = sceneRef.current;
    const mesh = meshesRef.current[itemId];
    if (!ctx || !mesh) return;

    const remainingItems = items.filter((it) => it.id !== itemId);
    const tier           = BASKET_TIERS[tierKey];

    // Fly-out removed item
    const exitPos = new THREE.Vector3(-6, 4, 6);
    startFlyOut(mesh, exitPos, () => {
      ctx.basketGroup.remove(mesh);
      mesh.traverse((c) => { if (c.geometry) c.geometry.dispose(); });
      delete meshesRef.current[itemId];
    });

    // Re-sort and snap remaining items
    if (remainingItems.length > 0) {
      const assignments = reassignSlots(remainingItems, slotsRef.current, tierKey);
      remainingItems.forEach((item) => {
        const m    = meshesRef.current[item.id];
        const slot = assignments[item.id];
        if (m && slot) applyItemTransform(m, slot, item, tier);
      });
    } else {
      // Reset all slot occupancy
      slotsRef.current.forEach((s) => { s.occupied = false; s.productId = null; });
    }

    setItems(remainingItems);
  }, [items, tierKey]);

  // ── Upgrade confirm ────────────────────────────────────────────────────────
  const confirmUpgrade = useCallback(() => {
    if (!upgradeModal) return;
    const { pendingProduct, nextTierKey } = upgradeModal;
    const ctx = sceneRef.current;
    if (ctx) startBasketMorph(ctx.basketGroup, 1, 1.04, () => {});
    setTierKey(nextTierKey);
    setUpgradeModal(null);
    setTimeout(() => {
      handleAddProduct(pendingProduct, null);
    }, 60);
  }, [upgradeModal, handleAddProduct]);

  // ── Totals ─────────────────────────────────────────────────────────────────
  const tier      = BASKET_TIERS[tierKey];
  const subtotal  = items.reduce((s, it) => s + (it.product.priceLow + it.product.priceHigh) / 2, 0);
  const basketCost = tier.cost;
  const fee       = Math.round(subtotal * (markup - 1));
  const total     = Math.round(subtotal + basketCost + fee);
  const itemCount = items.length;

  const catCounts = {};
  items.forEach((it) => {
    const cat = CATEGORIES.find((c) => c.products.some((p) => p.id === it.product.id));
    if (cat) catCounts[cat.id] = (catCounts[cat.id] || 0) + 1;
  });

  return (
    <div className="builder-grid">
      {/* Left controls */}
      <div className="builder-controls">
        <div className="section-eyebrow" style={{ color: 'var(--gold-soft)' }}>3D PREVIEW</div>
        <h2 className="section-title" style={{ color: 'var(--cream)', margin: '14px 0 12px' }}>
          See it come<br /><em>to life.</em>
        </h2>

        <div className="three-style-toggle">
          {['crate', 'wicker'].map((s) => (
            <button key={s} className={`style-btn ${style === s ? 'active' : ''}`} onClick={() => setStyle(s)}>
              {s === 'crate' ? 'Wooden Crate' : 'Wicker Basket'}
            </button>
          ))}
        </div>

        <div className="three-size-selector">
          {TIER_ORDER.map((key) => {
            const t = BASKET_TIERS[key];
            return (
              <button key={key} className={`size-btn ${tierKey === key ? 'active' : ''}`} onClick={() => setTierKey(key)}>
                <span className="size-name">{t.name}</span>
                <span className="size-slots">{t.maxSlots} items</span>
                <span className="size-cost">PKR {t.cost.toLocaleString()}</span>
              </button>
            );
          })}
        </div>

        <div className="capacity-bar-wrap">
          <div className="capacity-bar">
            <div className="capacity-fill" style={{ width: `${(itemCount / tier.maxSlots) * 100}%` }} />
          </div>
          <span className="capacity-label">{itemCount} / {tier.maxSlots} slots filled</span>
        </div>

        <p className="builder-lede" style={{ marginTop: 16 }}>
          Open a category. Tap a piece. Watch it land in 3D.
        </p>

        <div className="cat-list">
          {CATEGORIES.map((cat) => {
            const isOpen = openCat === cat.id;
            const count  = catCounts[cat.id] || 0;
            return (
              <div key={cat.id} className={`cat-row ${isOpen ? 'open' : ''}`}>
                <button className="cat-head" onClick={() => setOpenCat(isOpen ? null : cat.id)}>
                  <span className="cat-thumb">
                    <img src={cat.coverImg} alt="" onError={(e) => { e.target.src = PLACEHOLDER(cat.label.split(' ')[0]); }} />
                  </span>
                  <span className="cat-label">{cat.label}</span>
                  {count > 0 && <span className="cat-count">{count}</span>}
                  <span className="cat-chev">{isOpen ? '−' : '+'}</span>
                </button>
                <div className="cat-panel" style={{ maxHeight: isOpen ? cat.products.length * 88 + 16 : 0 }}>
                  {cat.products.map((p) => (
                    <button key={p.id} className="prod-row" onClick={(e) => handleAddProduct(p, e)}>
                      <span className="prod-thumb">
                        <img src={p.img} alt={p.name} onError={(e) => { e.target.src = PLACEHOLDER(p.brand); }} />
                      </span>
                      <span className="prod-meta">
                        <span className="prod-brand">{p.brand}</span>
                        <span className="prod-name">{p.name}</span>
                        <span className="prod-price-inline">from <b>PKR {p.priceLow.toLocaleString()}–{p.priceHigh.toLocaleString()}</b></span>
                      </span>
                      <span className="prod-add">＋</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: canvas + total */}
      <div className="builder-stage-col">
        <div className="builder-stage three-stage" ref={mountRef} style={{ position: 'relative', overflow: 'hidden' }}>
          {items.length > 0 && (
            <div className="three-items-overlay">
              {items.map((it) => (
                <button key={it.id} className="three-item-chip" onClick={() => handleRemoveItem(it.id)} title="Click to remove">
                  <img src={it.product.img} alt={it.product.name} onError={(e) => { e.target.src = PLACEHOLDER(it.product.brand); }} />
                  <span>{it.product.name}</span>
                  <span className="chip-remove">×</span>
                </button>
              ))}
            </div>
          )}
          {items.length === 0 && (
            <div className="basket-empty-hint" style={{ pointerEvents: 'none' }}>
              Pick a category. Tap a piece. Watch it appear in 3D.
            </div>
          )}
        </div>

        <div className={`basket-total-card total-${counterStyle}`}>
          <div className="total-rows">
            <div className="total-row">
              <span>ITEMS ({itemCount})</span>
              <span>PKR {Math.round(subtotal).toLocaleString()}</span>
            </div>
            <div className="total-row">
              <span>{tier.name.toUpperCase()} BASKET</span>
              <span>PKR {basketCost.toLocaleString()}</span>
            </div>
            <div className="total-row">
              <span>CURATION + RIBBON-TYING ({Math.round((markup - 1) * 100)}%)</span>
              <span>PKR {fee.toLocaleString()}</span>
            </div>
          </div>
          <div className="total-divider" />
          <div className="total-final">
            <div className="total-label">ESTIMATED TOTAL</div>
            <CasinoCounter value={total} style={counterStyle} />
          </div>
        </div>
      </div>

      {upgradeModal && (
        <div className="upgrade-modal-backdrop" onClick={() => setUpgradeModal(null)}>
          <div className="upgrade-modal" onClick={(e) => e.stopPropagation()}>
            <p className="upgrade-modal-text">
              Your basket needs more room! Upgrade to{' '}
              <strong>{BASKET_TIERS[upgradeModal.nextTierKey].name}</strong> (
              {BASKET_TIERS[upgradeModal.nextTierKey].maxSlots} items) for PKR{' '}
              {BASKET_TIERS[upgradeModal.nextTierKey].cost.toLocaleString()}?
            </p>
            <div className="upgrade-modal-actions">
              <button className="upgrade-btn primary"    onClick={confirmUpgrade}>Upgrade</button>
              <button className="upgrade-btn secondary"  onClick={() => setUpgradeModal(null)}>Keep current</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Pure helpers (no state, no hooks) ───────────────────────────────────────

function rebuildBasketMesh(basketGroup, tierKey, style) {
  const toRemove = basketGroup.children.filter((c) => c.userData.isBasket || c.name === 'gridHelper');
  toRemove.forEach((c) => {
    basketGroup.remove(c);
    c.traverse((ch) => { if (ch.geometry) ch.geometry.dispose(); });
  });
  const mesh = buildBasketMesh(tierKey, style);
  mesh.userData.isBasket = true;
  mesh.traverse((c) => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
  basketGroup.add(mesh);
  const grid = buildGridHelper(tierKey);
  basketGroup.add(grid);
}

// Compute the world-space landing position for an item (slot center + jitter)
function computeLandingPos(slot, item, tier) {
  const y = getItemY(slot, tier.interiorHeight);
  return new THREE.Vector3(
    slot.position.x + item.jitterX,
    y,
    slot.position.z + item.jitterZ
  );
}

// Apply final transform: position, tilt, Y-rotation, then boundary clamp
function applyItemTransform(mesh, slot, item, tier) {
  const pos = computeLandingPos(slot, item, tier);
  mesh.position.copy(pos);
  mesh.rotation.x = getItemTilt(slot, tier.rows);
  mesh.rotation.y = item.rotY;

  clampToBasket(mesh, tier.interiorWidth * 0.80, tier.interiorDepth * 0.80);
}

// Push mesh back inside the usable interior if its bounding box strays outside
function clampToBasket(mesh, usableW, usableD) {
  const box  = new THREE.Box3().setFromObject(mesh);
  const halfW = usableW / 2;
  const halfD = usableD / 2;

  if (box.min.x < -halfW) mesh.position.x += (-halfW - box.min.x);
  if (box.max.x >  halfW) mesh.position.x -= (box.max.x - halfW);
  if (box.min.z < -halfD) mesh.position.z += (-halfD - box.min.z);
  if (box.max.z >  halfD) mesh.position.z -= (box.max.z - halfD);
  if (box.min.y < 0)      mesh.position.y -= box.min.y;
}

function getClickOriginWorld(e, ctx, container) {
  if (!e?.currentTarget || !container) return new THREE.Vector3(-5, 5, 8);
  const rect  = container.getBoundingClientRect();
  const thumb = e.currentTarget.querySelector?.('.prod-thumb');
  if (!thumb) return new THREE.Vector3(-5, 5, 8);
  const tr    = thumb.getBoundingClientRect();
  const ndcX  = ((tr.left + tr.width / 2 - rect.left) / rect.width) * 2 - 1;
  const ndcY  = -((tr.top + tr.height / 2 - rect.top) / rect.height) * 2 + 1;
  const vec   = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(ctx.camera);
  vec.sub(ctx.camera.position).normalize();
  const dist  = (4 - ctx.camera.position.y) / vec.y;
  return ctx.camera.position.clone().addScaledVector(vec, dist);
}
