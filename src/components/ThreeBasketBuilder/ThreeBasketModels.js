import * as THREE from 'three';

const WOOD_COLOR = 0xc49a4a;
const WOOD_DARK  = 0x8b5e1a;
const WICKER_COLOR = 0xa67c52;
const WICKER_DARK  = 0x7a5230;

function woodMat(color = WOOD_COLOR) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.05 });
}
function wickerMat(color = WICKER_COLOR) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.95, metalness: 0.0 });
}

// ─── Wooden Crate ────────────────────────────────────────────────────────────
// 3 slats per wall — shallow enough that products fill it visually.
export function createCrateBasket(w, d, h) {
  const group = new THREE.Group();
  const SLATS = 3;
  const thickness = 0.055;
  const gap = 0.025;
  const slatH = (h - thickness - gap * (SLATS + 1)) / SLATS;
  const mat = woodMat();
  const matDark = woodMat(WOOD_DARK);

  // Base board
  const base = new THREE.Mesh(new THREE.BoxGeometry(w, thickness, d), matDark);
  base.position.y = thickness / 2;
  base.receiveShadow = true;
  group.add(base);

  // Interior floor (lighter, visible through top)
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(w - thickness * 2, 0.008, d - thickness * 2),
    new THREE.MeshStandardMaterial({ color: 0xdbb870, roughness: 0.88 })
  );
  floor.position.y = thickness + 0.004;
  floor.receiveShadow = true;
  group.add(floor);

  // Four walls from horizontal slats
  const wallDefs = [
    { axis: 'z', sign:  1, length: w, offset: d / 2 },
    { axis: 'z', sign: -1, length: w, offset: d / 2 },
    { axis: 'x', sign:  1, length: d, offset: w / 2 },
    { axis: 'x', sign: -1, length: d, offset: w / 2 },
  ];

  wallDefs.forEach(({ axis, sign, length, offset }) => {
    for (let i = 0; i < SLATS; i++) {
      const y = thickness + gap * (i + 1) + slatH * (i + 0.5);
      const geo = axis === 'z'
        ? new THREE.BoxGeometry(length, slatH, thickness)
        : new THREE.BoxGeometry(thickness, slatH, length);
      const slat = new THREE.Mesh(geo, mat);
      if (axis === 'z') slat.position.set(0, y, sign * offset);
      else              slat.position.set(sign * offset, y, 0);
      slat.castShadow = true;
      group.add(slat);
    }
  });

  // Corner posts
  const cornerH = h + thickness;
  const cornerGeo = new THREE.BoxGeometry(thickness * 1.6, cornerH, thickness * 1.6);
  [[1,1],[-1,1],[1,-1],[-1,-1]].forEach(([sx, sz]) => {
    const c = new THREE.Mesh(cornerGeo, matDark);
    c.position.set(sx * w / 2, cornerH / 2, sz * d / 2);
    c.castShadow = true;
    group.add(c);
  });

  // Handle — two vertical posts + crossbar rising from back wall
  const postH = h * 0.65;
  const postMat = woodMat(WOOD_DARK);
  [-1, 1].forEach((side) => {
    const post = new THREE.Mesh(new THREE.BoxGeometry(thickness, postH, thickness), postMat);
    post.position.set(side * w * 0.20, h + postH / 2, -d / 2);
    post.castShadow = true;
    group.add(post);
  });
  const cross = new THREE.Mesh(new THREE.BoxGeometry(w * 0.46, thickness, thickness), postMat);
  cross.position.set(0, h + postH, -d / 2);
  cross.castShadow = true;
  group.add(cross);

  return group;
}

// ─── Wicker Basket ───────────────────────────────────────────────────────────
// 4 horizontal rings — shallow so items fill the visual space.
export function createWickerBasket(w, d, h) {
  const group = new THREE.Group();
  const mat = wickerMat();
  const matDark = wickerMat(WICKER_DARK);
  const BANDS = 4;
  const STAVES = 18;
  const topR = Math.max(w, d) / 2;
  const botR = topR * 0.80;

  // Horizontal weave rings
  for (let b = 0; b < BANDS; b++) {
    const t = b / (BANDS - 1);
    const y = 0.06 + (h - 0.06) * t;
    const r = THREE.MathUtils.lerp(botR, topR, t);
    const bandH = (h / BANDS) * 0.52;
    const geo = new THREE.TorusGeometry(r, bandH * 0.5, 4, 36);
    const ring = new THREE.Mesh(geo, b % 2 === 0 ? mat : matDark);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    ring.castShadow = true;
    group.add(ring);
  }

  // Vertical staves
  for (let s = 0; s < STAVES; s++) {
    const angle = (s / STAVES) * Math.PI * 2;
    const r = (botR + topR) / 2;
    const stave = new THREE.Mesh(new THREE.BoxGeometry(0.035, h, 0.035), matDark);
    stave.position.set(Math.cos(angle) * r, h / 2, Math.sin(angle) * r);
    stave.rotation.y = -angle;
    stave.castShadow = true;
    group.add(stave);
  }

  // Rim torus
  const rim = new THREE.Mesh(new THREE.TorusGeometry(topR, 0.055, 6, 44), matDark);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = h;
  rim.castShadow = true;
  group.add(rim);

  // Base disk
  const base = new THREE.Mesh(new THREE.CylinderGeometry(botR, botR * 0.92, 0.07, 32), matDark);
  base.position.y = 0.035;
  base.receiveShadow = true;
  group.add(base);

  // Interior floor
  const floor = new THREE.Mesh(
    new THREE.CylinderGeometry(botR * 0.9, botR * 0.9, 0.008, 32),
    new THREE.MeshStandardMaterial({ color: 0xc8955a, roughness: 0.9 })
  );
  floor.position.y = 0.075;
  floor.receiveShadow = true;
  group.add(floor);

  // Arched handle (rises 1.5× wall height above rim)
  const handlePts = [];
  for (let i = 0; i <= 20; i++) {
    const a = (i / 20) * Math.PI;
    handlePts.push(new THREE.Vector3(
      Math.cos(a) * topR * 0.52,
      Math.sin(a) * h * 1.5,
      0
    ));
  }
  const handleCurve = new THREE.CatmullRomCurve3(handlePts);
  const handle = new THREE.Mesh(new THREE.TubeGeometry(handleCurve, 20, 0.042, 6, false), matDark);
  handle.position.set(0, h, 0);
  handle.castShadow = true;
  group.add(handle);

  // Ribbon bow (front)
  const bowMat = new THREE.MeshStandardMaterial({ color: 0xf4c2c2, roughness: 0.6 });
  [-1, 1].forEach((side) => {
    const loop = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.036, 4, 12, Math.PI), bowMat);
    loop.rotation.z = side * Math.PI / 4;
    loop.position.set(side * 0.09, h * 0.82, topR + 0.01);
    group.add(loop);
  });
  const knot = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), bowMat);
  knot.position.set(0, h * 0.82, topR + 0.01);
  group.add(knot);

  return group;
}
