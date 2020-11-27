export interface Vector2f {
  x: number;
  y: number;
}

export function add(a: Vector2f, b: Vector2f): Vector2f {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function subtract(a: Vector2f, b: Vector2f): Vector2f {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function multiply(a: Vector2f, b: number): Vector2f {
  return { x: a.x * b, y: a.y * b };
}

export function divide(a: Vector2f, b: number): Vector2f {
  return { x: a.x / b, y: a.y / b };
}

export function dot(a: Vector2f, b: Vector2f) {
  return a.x * b.x + a.y * b.y;
}

export function magnitudeSqrd(a: Vector2f): number {
  return a.x ** 2 + a.y ** 2;
}

export function magnitude(a: Vector2f): number {
  return Math.sqrt(magnitudeSqrd(a));
}

export function normalise(a: Vector2f): Vector2f {
  let m = magnitude(a);
  return m == 0 ? { x: 0, y: 0 } : divide(a, m);
}
