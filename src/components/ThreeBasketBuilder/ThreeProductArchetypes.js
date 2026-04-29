import * as THREE from 'three';

const texLoader = new THREE.TextureLoader();

function loadTex(url, onLoad) {
  texLoader.crossOrigin = 'anonymous';
  texLoader.load(url, onLoad, undefined, () => onLoad(null));
}

// Per-archetype slot targets:
//   widthPct  — fraction of cellSize for the widest horizontal dimension
//   heightPct — fraction of basketInteriorHeight for the item's height
//               values > 1.0 mean the item peeks above the basket rim
// widthPct capped at 0.75 so adjacent items have a 25% breathing gap
const SLOT_TARGETS = {
  suit:      { widthPct: 0.75, heightPct: 0.45 },
  perfume:   { widthPct: 0.40, heightPct: 1.10 },
  bouquet:   { widthPct: 0.75, heightPct: 1.30 },
  plush:     { widthPct: 0.70, heightPct: 0.90 },
  chocolate: { widthPct: 0.75, heightPct: 0.35 },
  candle:    { widthPct: 0.55, heightPct: 0.72 },
  skincare:  { widthPct: 0.36, heightPct: 1.00 },
};

// Scale XZ independently from Y so each archetype hits its width AND height target.
// Floor-snaps after (bottom of mesh sits at y = 0 in local space).
function fitToSlot(group, cellSize, interiorHeight, archetypeType) {
  const { widthPct, heightPct } = SLOT_TARGETS[archetypeType] || { widthPct: 0.85, heightPct: 0.80 };

  let box = new THREE.Box3().setFromObject(group);
  const size = new THREE.Vector3();
  box.getSize(size);

  // Scale XZ to target width
  const maxXZ = Math.max(size.x, size.z);
  const xzScale = (cellSize * widthPct) / maxXZ;
  group.scale.x *= xzScale;
  group.scale.z *= xzScale;

  // Scale Y independently to target height
  box = new THREE.Box3().setFromObject(group);
  box.getSize(size);
  group.scale.y *= (interiorHeight * heightPct) / size.y;

  // Floor-snap: shift mesh so its bottom face is at y = 0
  box = new THREE.Box3().setFromObject(group);
  group.position.y = -box.min.y;
}

function labelMat() {
  return new THREE.MeshStandardMaterial({ color: 0xf8f4ee, roughness: 0.5 });
}

// ─── Suit / Folded Fabric Bundle ─────────────────────────────────────────────
// Canonical: 1.2 wide × 0.6 tall × 1.0 deep  (wide & flat)
function makeSuit(cellSize, interiorHeight) {
  const g = new THREE.Group();

  const bodyGeo = new THREE.BoxGeometry(1.2, 0.6, 1.0);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x8a6d3b, roughness: 0.88 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.3;
  body.castShadow = true;
  g.add(body);

  // Ribbon cross on top
  const ribMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.4 });
  const rH = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.05, 0.07), ribMat);
  rH.position.y = 0.63;
  g.add(rH);
  const rV = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, 1.02), ribMat);
  rV.position.y = 0.63;
  g.add(rV);

  // Label on front face
  const lMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.42), labelMat());
  lMesh.name = 'label';
  lMesh.position.set(0, 0.3, 0.502);
  g.add(lMesh);

  fitToSlot(g, cellSize, interiorHeight, 'suit');
  return g;
}

// ─── Perfume Bottle ──────────────────────────────────────────────────────────
// Canonical: ~0.6 wide × 1.1 tall (narrow & tall)
function makePerfume(cellSize, interiorHeight) {
  const g = new THREE.Group();

  const pts = [
    new THREE.Vector2(0,    0),
    new THREE.Vector2(0.28, 0),
    new THREE.Vector2(0.30, 0.08),
    new THREE.Vector2(0.30, 0.58),
    new THREE.Vector2(0.13, 0.68),
    new THREE.Vector2(0.10, 0.80),
    new THREE.Vector2(0.13, 0.85),
    new THREE.Vector2(0.13, 1.00),
    new THREE.Vector2(0,    1.00),
  ];
  const bodyGeo = new THREE.LatheGeometry(pts, 14);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xe8d5a3, roughness: 0.28, metalness: 0.12 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.castShadow = true;
  g.add(body);

  const lMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.28), labelMat());
  lMesh.name = 'label';
  lMesh.position.set(0, 0.34, 0.305);
  g.add(lMesh);

  fitToSlot(g, cellSize, interiorHeight, 'perfume');
  return g;
}

// ─── Bouquet Cone ────────────────────────────────────────────────────────────
// Canonical: 0.9 wide × 1.4 tall
function makeBouquet(cellSize, interiorHeight) {
  const g = new THREE.Group();

  const coneMat = new THREE.MeshStandardMaterial({ color: 0xfce4ec, roughness: 0.85 });
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.8, 16), coneMat);
  cone.position.y = 0.4;
  cone.castShadow = true;
  g.add(cone);

  // Flower cluster
  const flowerMat = new THREE.MeshStandardMaterial({ color: 0xff6b8a, roughness: 0.8 });
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 6), flowerMat);
    s.position.set(Math.cos(a) * 0.2, 0.92, Math.sin(a) * 0.2);
    s.castShadow = true;
    g.add(s);
  }
  const center = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 6), flowerMat);
  center.position.y = 1.02;
  center.castShadow = true;
  g.add(center);

  // Leaves
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x4a7c59, roughness: 0.9, side: THREE.DoubleSide });
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.4;
    const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.38), leafMat);
    leaf.position.set(Math.cos(a) * 0.3, 0.78, Math.sin(a) * 0.3);
    leaf.rotation.y = -a;
    leaf.rotation.z = 0.4;
    g.add(leaf);
  }

  // Label on wrapper
  const lMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.32), labelMat());
  lMesh.name = 'label';
  lMesh.position.set(0, 0.36, 0.46);
  g.add(lMesh);

  fitToSlot(g, cellSize, interiorHeight, 'bouquet');
  return g;
}

// ─── Plush Toy ───────────────────────────────────────────────────────────────
// Canonical: ~0.8 wide × 1.0 tall (roughly cubic)
function makePlush(cellSize, interiorHeight) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0xf9c2d0, roughness: 0.95 });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 10), mat);
  body.scale.set(1, 0.85, 0.88);
  body.position.y = 0.34;
  body.castShadow = true;
  g.add(body);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.27, 12, 10), mat);
  head.position.y = 0.88;
  head.castShadow = true;
  g.add(head);

  [-1, 1].forEach((side) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 6), mat);
    ear.position.set(side * 0.22, 1.10, 0);
    g.add(ear);
  });

  // Eyes (tiny dark spheres)
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x1a0a06 });
  [-1, 1].forEach((side) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), eyeMat);
    eye.position.set(side * 0.09, 0.91, 0.255);
    g.add(eye);
  });

  const lMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.2), labelMat());
  lMesh.name = 'label';
  lMesh.position.set(0, 0.88, 0.278);
  g.add(lMesh);

  fitToSlot(g, cellSize, interiorHeight, 'plush');
  return g;
}

// ─── Chocolate Gift Box ──────────────────────────────────────────────────────
// Canonical: 1.1 wide × 0.42 tall × 0.9 deep (wide & flat)
function makeChocolates(cellSize, interiorHeight) {
  const g = new THREE.Group();

  const boxMat = new THREE.MeshStandardMaterial({ color: 0x3d1c02, roughness: 0.68 });
  const box = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.36, 0.9), boxMat);
  box.position.y = 0.18;
  box.castShadow = true;
  g.add(box);

  const lidMat = new THREE.MeshStandardMaterial({ color: 0x5c2d0a, roughness: 0.6 });
  const lid = new THREE.Mesh(new THREE.BoxGeometry(1.13, 0.07, 0.93), lidMat);
  lid.position.y = 0.395;
  lid.castShadow = true;
  g.add(lid);

  const ribMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.4 });
  const rH = new THREE.Mesh(new THREE.BoxGeometry(1.14, 0.02, 0.07), ribMat);
  rH.position.y = 0.435;
  g.add(rH);
  const rV = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.02, 0.94), ribMat);
  rV.position.y = 0.435;
  g.add(rV);

  // Bow loops
  const bowMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.35 });
  [-1, 1].forEach((s) => {
    const loop = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.025, 4, 10, Math.PI), bowMat);
    loop.rotation.z = s * Math.PI / 4;
    loop.position.set(s * 0.07, 0.5, 0);
    g.add(loop);
  });

  const lMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 0.42), labelMat());
  lMesh.name = 'label';
  lMesh.rotation.x = -Math.PI / 2;
  lMesh.position.set(0, 0.447, 0);
  g.add(lMesh);

  fitToSlot(g, cellSize, interiorHeight, 'chocolate');
  return g;
}

// ─── Candle Jar ──────────────────────────────────────────────────────────────
// Canonical: 0.6 wide × 0.78 tall
function makeCandle(cellSize, interiorHeight) {
  const g = new THREE.Group();

  const jarMat = new THREE.MeshStandardMaterial({
    color: 0xe8e0d0, roughness: 0.12, transparent: true, opacity: 0.78,
  });
  const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.27, 0.65, 22), jarMat);
  jar.position.y = 0.335;
  jar.castShadow = true;
  g.add(jar);

  const waxMat = new THREE.MeshStandardMaterial({ color: 0xf5e6c8, roughness: 0.88 });
  const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.25, 0.52, 18), waxMat);
  wax.position.y = 0.30;
  g.add(wax);

  const lidMat = new THREE.MeshStandardMaterial({ color: 0xc8b89a, roughness: 0.5 });
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.045, 22), lidMat);
  lid.position.y = 0.685;
  lid.castShadow = true;
  g.add(lid);

  const lMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.28), labelMat());
  lMesh.name = 'label';
  lMesh.position.set(0, 0.34, 0.302);
  g.add(lMesh);

  fitToSlot(g, cellSize, interiorHeight, 'candle');
  return g;
}

// ─── Skincare Tube ───────────────────────────────────────────────────────────
// Canonical: 0.36 wide × 1.1 tall (narrow & tall)
function makeSkincare(cellSize, interiorHeight) {
  const g = new THREE.Group();

  const tubeMat = new THREE.MeshStandardMaterial({ color: 0xf0e6d3, roughness: 0.5 });
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.72, 16), tubeMat);
  tube.position.y = 0.4;
  tube.castShadow = true;
  g.add(tube);

  // Rounded bottom cap
  const capBot = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    tubeMat
  );
  capBot.rotation.x = Math.PI;
  capBot.position.y = 0.04;
  g.add(capBot);

  const pumpMat = new THREE.MeshStandardMaterial({ color: 0xb09070, roughness: 0.4 });
  const pBase = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.09, 16), pumpMat);
  pBase.position.y = 0.805;
  pBase.castShadow = true;
  g.add(pBase);

  const pNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.20, 10), pumpMat);
  pNeck.position.y = 0.955;
  g.add(pNeck);

  const pHead = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.05, 0.065, 10), pumpMat);
  pHead.position.y = 1.088;
  g.add(pHead);

  const lMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.38), labelMat());
  lMesh.name = 'label';
  lMesh.position.set(0, 0.42, 0.182);
  g.add(lMesh);

  fitToSlot(g, cellSize, interiorHeight, 'skincare');
  return g;
}

// ─── Factory ─────────────────────────────────────────────────────────────────

const MAKERS = {
  suit:      makeSuit,
  perfume:   makePerfume,
  bouquet:   makeBouquet,
  plush:     makePlush,
  chocolate: makeChocolates,
  candle:    makeCandle,
  skincare:  makeSkincare,
};

export function createProductMesh(product, cellSize, interiorHeight) {
  const maker = MAKERS[product.basketSlot] || makeSuit;
  const group = maker(cellSize, interiorHeight);

  // Async: apply product photo to the 'label' child
  const labelMesh = group.getObjectByName('label');
  if (labelMesh && product.img) {
    loadTex(product.img, (texture) => {
      if (!texture) return;
      texture.colorSpace = THREE.SRGBColorSpace;
      labelMesh.material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.5 });
    });
  }

  return group;
}
