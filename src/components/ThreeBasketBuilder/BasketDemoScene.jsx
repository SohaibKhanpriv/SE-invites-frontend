import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CATEGORIES } from '../../config/builderProducts';
import {
  initScene,
  buildBasketMesh,
  buildGridHelper,
  startFlyIn,
  startFlyOut,
} from './ThreeBasketScene';
import { createProductMesh } from './ThreeProductArchetypes';
import {
  BASKET_TIERS,
  calculateSlotPositions,
  reassignSlots,
  getCellSize,
  getInteriorHeight,
  getItemY,
  getItemTilt,
} from './ThreeBasketGrid';

// One product per category — the "curated demo basket"
const DEMO_TIER  = 'M';   // Classic, 6 slots
const DEMO_STYLE = 'crate';
const ADD_INTERVAL_MS  = 1800;  // time between each item flying in
const HOLD_FULL_MS     = 3200;  // pause once basket is full before reset
const CLEAR_STAGGER_MS = 220;   // stagger between fly-outs on reset

const DEMO_ITEMS = [
  { product: CATEGORIES[0].products[0], label: 'Embroidered suit' },          // suit
  { product: CATEGORIES[4].products[0], label: 'Artisan chocolate box' },     // chocolate
  { product: CATEGORIES[1].products[0], label: 'Parfum · SE' },               // perfume
  { product: CATEGORIES[5].products[0], label: 'Scented candle jar' },        // candle
  { product: CATEGORIES[3].products[0], label: 'Plush keepsake' },            // plush
  { product: CATEGORIES[2].products[0], label: 'Mini bouquet' },              // bouquet
];

export function BasketDemoScene() {
  const mountRef  = useRef(null);
  const sceneRef  = useRef(null);
  const slotsRef  = useRef([]);
  const meshesRef = useRef([]);   // array of { mesh, item }
  const timerRef  = useRef(null);

  const [activeStep, setActiveStep] = useState(-1);   // which step label is lit
  const [phase, setPhase]           = useState('adding'); // 'adding' | 'full' | 'clearing'

  // ── Scene init ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const container = mountRef.current;
    if (!container || sceneRef.current) return;

    const ctx = initScene(container);
    sceneRef.current = ctx;

    // Build basket
    const basket = buildBasketMesh(DEMO_TIER, DEMO_STYLE);
    basket.userData.isBasket = true;
    basket.traverse((c) => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
    ctx.basketGroup.add(basket);
    ctx.basketGroup.add(buildGridHelper(DEMO_TIER));

    slotsRef.current = calculateSlotPositions(DEMO_TIER);

    // Slow gentle rotation for cinematic feel
    let raf;
    let t0 = performance.now();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const elapsed = (performance.now() - t0) / 1000;
      ctx.basketGroup.rotation.y = Math.sin(elapsed * 0.25) * 0.18;
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
      clearTimeout(timerRef.current);
      ctx.renderer.dispose();
      if (container.contains(ctx.renderer.domElement)) {
        container.removeChild(ctx.renderer.domElement);
      }
      sceneRef.current = null;
    };
  }, []);

  // ── Auto-play loop ─────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    let step = 0;

    const tier         = BASKET_TIERS[DEMO_TIER];
    const cellSize     = getCellSize(DEMO_TIER);
    const interiorH    = getInteriorHeight(DEMO_TIER);

    function scheduleNextAdd() {
      timerRef.current = setTimeout(() => {
        if (cancelled) return;
        const ctx = sceneRef.current;
        if (!ctx) return;

        if (step >= DEMO_ITEMS.length) {
          // Basket full — hold, then clear
          setPhase('full');
          timerRef.current = setTimeout(() => {
            if (cancelled) return;
            clearBasket(cancelled, () => {
              if (!cancelled) {
                step = 0;
                setActiveStep(-1);
                setPhase('adding');
                scheduleNextAdd();
              }
            });
          }, HOLD_FULL_MS);
          return;
        }

        const { product } = DEMO_ITEMS[step];
        const itemRec = {
          id:      `demo-${step}`,
          product,
          rotY:    (Math.random() - 0.5) * 0.18,
          jitterX: (Math.random() - 0.5) * cellSize * 0.05,
          jitterZ: (Math.random() - 0.5) * cellSize * 0.05,
        };

        // Build virtual items list up to this step
        const allItems = DEMO_ITEMS.slice(0, step + 1).map((di, i) => ({
          id:      `demo-${i}`,
          product: di.product,
          rotY:    meshesRef.current[i]?.rotY ?? 0,
          jitterX: meshesRef.current[i]?.jitterX ?? 0,
          jitterZ: meshesRef.current[i]?.jitterZ ?? 0,
        }));
        // patch in the new item's jitter
        allItems[step].rotY    = itemRec.rotY;
        allItems[step].jitterX = itemRec.jitterX;
        allItems[step].jitterZ = itemRec.jitterZ;

        const assignments = reassignSlots(allItems, slotsRef.current, DEMO_TIER);

        // Snap existing meshes to their (possibly re-sorted) slots
        for (let i = 0; i < step; i++) {
          const existing = meshesRef.current[i];
          if (!existing) continue;
          const slot = assignments[`demo-${i}`];
          if (slot) applyTransform(existing.mesh, slot, existing, tier);
        }

        // Create and fly-in new mesh
        const mesh = createProductMesh(product, cellSize, interiorH);
        mesh.visible = true;
        ctx.basketGroup.add(mesh);

        const slot       = assignments[`demo-${step}`];
        const landingPos = new THREE.Vector3(
          slot.position.x + itemRec.jitterX,
          getItemY(slot, interiorH),
          slot.position.z + itemRec.jitterZ
        );
        const origin = new THREE.Vector3(-5, 5, 8); // fly in from upper-left

        startFlyIn(mesh, origin, landingPos, tier.h, itemRec.rotY, () => {
          if (!cancelled) applyTransform(mesh, slot, itemRec, tier);
        });

        meshesRef.current[step] = { mesh, ...itemRec };

        setActiveStep(step);
        step++;
        scheduleNextAdd();
      }, ADD_INTERVAL_MS);
    }

    function clearBasket(isCancelled, onDone) {
      if (isCancelled) return;
      setPhase('clearing');
      const ctx = sceneRef.current;
      if (!ctx) { onDone(); return; }

      const total = meshesRef.current.filter(Boolean).length;
      let done = 0;

      meshesRef.current.forEach((rec, i) => {
        if (!rec) return;
        setTimeout(() => {
          if (isCancelled) return;
          const exitPos = new THREE.Vector3(
            (Math.random() - 0.5) * 8,
            5 + Math.random() * 2,
            6
          );
          startFlyOut(rec.mesh, exitPos, () => {
            ctx.basketGroup.remove(rec.mesh);
            rec.mesh.traverse((c) => { if (c.geometry) c.geometry.dispose(); });
            done++;
            if (done >= total) {
              // Reset slots
              slotsRef.current = calculateSlotPositions(DEMO_TIER);
              meshesRef.current = [];
              onDone();
            }
          });
        }, i * CLEAR_STAGGER_MS);
      });

      if (total === 0) { meshesRef.current = []; onDone(); }
    }

    scheduleNextAdd();

    return () => {
      cancelled = true;
      clearTimeout(timerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="basket-section" id="baskets">
      <div className="basket-demo-layout">
        {/* Left copy */}
        <div className="basket-copy">
          <div className="section-eyebrow">CUSTOM GIFT BASKETS</div>
          <h2 className="section-title">
            Watch it come
            <br />
            <em>together</em>.
          </h2>
          <p>
            Tell us the person. We shop, wrap, light it up and deliver.
            Every basket is a story we assemble by hand, piece by piece.
          </p>

          <div className="basket-step-list">
            {DEMO_ITEMS.map((di, i) => (
              <div key={i} className={`basket-step ${i <= activeStep ? 'active' : ''}`}>
                <div className="basket-step-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="basket-step-label">{di.label}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 30 }}>
            <a
              className="btn btn-ghost"
              href="#order"
              style={{ borderColor: 'var(--gold-soft)', color: 'var(--gold-soft)' }}
            >
              Customize a basket &rarr;
            </a>
          </div>
        </div>

        {/* 3D canvas */}
        <div className="basket-stage-wrap">
          <div
            className="builder-stage three-stage demo-three-stage"
            ref={mountRef}
            style={{ position: 'relative', overflow: 'hidden', borderRadius: 8 }}
          />
          <div className="basket-progress-caption">
            {phase === 'full'
              ? `FULLY ASSEMBLED · RESTARTING SOON`
              : phase === 'clearing'
              ? 'CLEARING BASKET…'
              : `${activeStep + 1} / ${DEMO_ITEMS.length} PIECES · ASSEMBLING`}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function applyTransform(mesh, slot, item, tier) {
  const y = getItemY(slot, tier.interiorHeight);
  mesh.position.set(slot.position.x + item.jitterX, y, slot.position.z + item.jitterZ);
  mesh.rotation.x = getItemTilt(slot, tier.rows);
  mesh.rotation.y = item.rotY;

  // Boundary clamp
  const box   = new THREE.Box3().setFromObject(mesh);
  const halfW = tier.interiorWidth * 0.40;
  const halfD = tier.interiorDepth * 0.40;
  if (box.min.x < -halfW) mesh.position.x += (-halfW - box.min.x);
  if (box.max.x >  halfW) mesh.position.x -= (box.max.x - halfW);
  if (box.min.z < -halfD) mesh.position.z += (-halfD - box.min.z);
  if (box.max.z >  halfD) mesh.position.z -= (box.max.z - halfD);
  if (box.min.y < 0)      mesh.position.y -= box.min.y;
}
