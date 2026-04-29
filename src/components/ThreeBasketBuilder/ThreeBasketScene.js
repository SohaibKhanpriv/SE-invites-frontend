import * as THREE from 'three';
import { createCrateBasket, createWickerBasket } from './ThreeBasketModels';
import { createProductMesh } from './ThreeProductArchetypes';
import { BASKET_TIERS, calculateSlotPositions } from './ThreeBasketGrid';

export function initScene(container) {
  const W = container.clientWidth;
  const H = container.clientHeight;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // Scene
  const scene = new THREE.Scene();

  // Lights
  const ambient = new THREE.AmbientLight(0xf6ecdf, 0.55);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xfff5e0, 1.1);
  sun.position.set(5, 10, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 40;
  sun.shadow.camera.left = -8;
  sun.shadow.camera.right = 8;
  sun.shadow.camera.top = 8;
  sun.shadow.camera.bottom = -8;
  scene.add(sun);

  const fill = new THREE.DirectionalLight(0x6b1f2a, 0.18);
  fill.position.set(-4, -2, -5);
  scene.add(fill);

  // Shadow plane
  const shadowGeo = new THREE.PlaneGeometry(12, 12);
  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.35 });
  const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -0.02;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  // Camera — close and low, like looking at a basket on a table
  const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
  camera.position.set(0, 4.0, 6.5);
  camera.lookAt(0, 0.7, 0);

  // Basket group
  const basketGroup = new THREE.Group();
  scene.add(basketGroup);

  return { renderer, scene, camera, basketGroup };
}

export function buildBasketMesh(tierKey, style) {
  const tier = BASKET_TIERS[tierKey];
  return style === 'wicker'
    ? createWickerBasket(tier.w, tier.d, tier.h)
    : createCrateBasket(tier.w, tier.d, tier.h);
}

export function buildGridHelper(tierKey) {
  const tier = BASKET_TIERS[tierKey];
  const grid = new THREE.GridHelper(
    Math.max(tier.interiorWidth, tier.interiorDepth),
    Math.max(tier.cols, tier.rows),
    0xd4af37,
    0xd4af37
  );
  grid.material.opacity = 0.25;
  grid.material.transparent = true;
  grid.position.y = 0.12;
  grid.name = 'gridHelper';
  return grid;
}

export function placeProductMesh(productMesh, slot, basketH) {
  productMesh.position.copy(slot.position);
  productMesh.position.y = basketH * 0.12;
}

// targetPos: THREE.Vector3 — the exact world position the item should land at.
// finalRotY: the persistent Y rotation for this item.
// onDone: called when animation finishes (caller applies final transform).
export function startFlyIn(productMesh, originWorld, targetPos, basketH, finalRotY, onDone) {
  const target = targetPos.clone();
  const start = originWorld.clone();
  const peak = new THREE.Vector3(
    (start.x + target.x) / 2,
    Math.max(start.y, target.y) + basketH * 2.2,
    (start.z + target.z) / 2
  );

  const fittedScale = productMesh.scale.clone();
  const duration = 850;
  const startTime = performance.now();

  function tick() {
    const t = Math.min(1, (performance.now() - startTime) / duration);
    const ease = 1 - Math.pow(1 - t, 3);
    const mt = 1 - ease;

    productMesh.position.set(
      mt * mt * start.x + 2 * mt * ease * peak.x + ease * ease * target.x,
      mt * mt * start.y + 2 * mt * ease * peak.y + ease * ease * target.y,
      mt * mt * start.z + 2 * mt * ease * peak.z + ease * ease * target.z
    );
    // Spin in, settle to final Y rotation
    productMesh.rotation.y = (1 - ease) * Math.PI + ease * finalRotY;
    const s = 0.3 + 0.7 * ease;
    productMesh.scale.set(fittedScale.x * s, fittedScale.y * s, fittedScale.z * s);

    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      onDone?.();
    }
  }
  requestAnimationFrame(tick);
}

export function startFlyOut(productMesh, exitWorld, onDone) {
  const start = productMesh.position.clone();
  const duration = 650;
  const startTime = performance.now();

  function tick() {
    const t = Math.min(1, (performance.now() - startTime) / duration);
    const ease = t * t;

    productMesh.position.lerpVectors(start, exitWorld, ease);
    productMesh.scale.setScalar(0.55 * (1 - ease * 0.8));
    productMesh.material?.forEach?.((m) => { if (m) m.opacity = 1 - ease; });

    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      onDone?.();
    }
  }
  requestAnimationFrame(tick);
}

export function startBasketMorph(basketGroup, fromScale, toScale, onDone) {
  const duration = 600;
  const startTime = performance.now();

  function tick() {
    const t = Math.min(1, (performance.now() - startTime) / duration);
    const ease = 1 - Math.pow(1 - t, 3);
    const s = fromScale + (toScale - fromScale) * ease;
    basketGroup.scale.setScalar(s);
    if (t < 1) requestAnimationFrame(tick);
    else onDone?.();
  }
  requestAnimationFrame(tick);
}
