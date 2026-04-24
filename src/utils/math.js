/**
 * Quadratic bezier interpolation for arc-based animations.
 * (1-t)^2 * a + 2(1-t)t * b + t^2 * c
 */
export function arcLerp(a, b, c, t) {
  const u = 1 - t;
  return u * u * a + 2 * u * t * b + t * t * c;
}
