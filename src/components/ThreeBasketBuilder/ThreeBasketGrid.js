import * as THREE from 'three';

export const BASKET_TIERS = {
  S: { name: 'Petite',  cols: 2, rows: 2, maxSlots: 4,  cost: 500,  interiorWidth: 2.5, interiorDepth: 2.0, interiorHeight: 0.80, w: 3.0, d: 2.5, h: 0.88 },
  M: { name: 'Classic', cols: 3, rows: 2, maxSlots: 6,  cost: 800,  interiorWidth: 3.5, interiorDepth: 2.8, interiorHeight: 0.90, w: 4.0, d: 3.3, h: 0.99 },
  L: { name: 'Grande',  cols: 3, rows: 3, maxSlots: 9,  cost: 1200, interiorWidth: 4.2, interiorDepth: 3.5, interiorHeight: 1.00, w: 4.8, d: 4.0, h: 1.10 },
  XL:{ name: 'Royal',   cols: 4, rows: 3, maxSlots: 12, cost: 1800, interiorWidth: 5.0, interiorDepth: 4.2, interiorHeight: 1.10, w: 5.7, d: 4.8, h: 1.21 },
};

export const TIER_ORDER = ['S', 'M', 'L', 'XL'];

// Flat items first (front row), tall items last (back row — visible over shorter ones)
export const HEIGHT_PRIORITY = {
  chocolate: 1,
  suit:      2,
  candle:    3,
  plush:     4,
  skincare:  5,
  perfume:   6,
  bouquet:   7,
};

export function nextTier(currentKey) {
  const idx = TIER_ORDER.indexOf(currentKey);
  return idx < TIER_ORDER.length - 1 ? TIER_ORDER[idx + 1] : null;
}

export function getCellSize(tierKey) {
  const { cols, rows, interiorWidth, interiorDepth } = BASKET_TIERS[tierKey];
  // Use 80% of interior to leave wall inset
  return Math.min((interiorWidth * 0.80) / cols, (interiorDepth * 0.80) / rows);
}

export function getInteriorHeight(tierKey) {
  return BASKET_TIERS[tierKey].interiorHeight;
}

// Y position: back rows elevated like tissue-paper stacking
export function getItemY(slot, interiorHeight) {
  return 0.05 + slot.row * (interiorHeight * 0.08);
}

// X tilt: back rows lean slightly toward viewer so they're visible
export function getItemTilt(slot, totalRows) {
  if (totalRows <= 1 || slot.row === 0) return 0;
  if (slot.row === totalRows - 1) return -0.15;
  return -0.08;
}

// Build slot grid with 10% wall inset so edge items never clip through walls
export function calculateSlotPositions(tierKey) {
  const tier = BASKET_TIERS[tierKey];
  const { cols, rows, interiorWidth, interiorDepth } = tier;
  const usableW = interiorWidth * 0.80;
  const usableD = interiorDepth * 0.80;
  const cellW = usableW / cols;
  const cellD = usableD / rows;

  const slots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      slots.push({
        id: `${c}-${r}`,
        col: c,
        row: r,
        occupied: false,
        productId: null,
        cellW,
        cellD,
        position: new THREE.Vector3(
          (c - (cols - 1) / 2) * cellW,
          0,
          (r - (rows - 1) / 2) * cellD
        ),
      });
    }
  }
  return slots;
}

// Re-sort items by height priority and assign front-to-back.
// Returns { [itemId]: slot } mapping.
export function reassignSlots(items, slots, tierKey) {
  const { rows } = BASKET_TIERS[tierKey];

  // Reset all slot occupancy
  slots.forEach((s) => { s.occupied = false; s.productId = null; });

  // Sort: flat items → front rows, tall items → back rows
  const sorted = [...items].sort(
    (a, b) =>
      (HEIGHT_PRIORITY[a.product.basketSlot] ?? 4) -
      (HEIGHT_PRIORITY[b.product.basketSlot] ?? 4)
  );

  // Flatten slots row-by-row: row 0 (front) first
  const orderedSlots = [];
  for (let r = 0; r < rows; r++) {
    orderedSlots.push(...slots.filter((s) => s.row === r));
  }

  const assignments = {};
  sorted.forEach((item, i) => {
    if (i < orderedSlots.length) {
      orderedSlots[i].occupied = true;
      orderedSlots[i].productId = item.id;
      assignments[item.id] = orderedSlots[i];
    }
  });

  return assignments;
}
