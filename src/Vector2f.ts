export class Vector2f {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  copy(v: Vector2f): Vector2f {
    return new Vector2f(v.x, v.y);
  }

  add(v: Vector2f): Vector2f {
    return new Vector2f(this.x + v.x, this.y + v.y);
  }

  subtract(v: Vector2f): Vector2f {
    return new Vector2f(this.x - v.x, this.y - v.y);
  }

  multiply(s: number): Vector2f {
    return new Vector2f(this.x * s, this.y * s);
  }

  divide(s: number): Vector2f {
    return new Vector2f(this.x / s, this.y / s);
  }

  dot(a: Vector2f, b: Vector2f) {
    return a.x * b.x + a.y * b.y;
  }

  magnitudeSqrd(): number {
    return this.x ** 2 + this.y ** 2;
  }

  magnitude(): number {
    return Math.sqrt(this.magnitudeSqrd());
  }

  normalise(): Vector2f {
    let m = this.magnitude();
    return m == 0 ? new Vector2f(0, 0) : this.divide(m);
  }
}
