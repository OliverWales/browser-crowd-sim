export class Vector2f {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toString(): string {
    return `(${this.x}, ${this.y})`;
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

  dot(v: Vector2f) {
    return this.x * v.x + this.y * v.y;
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

  sample(maxRadius: number) {
    // Uniformly sample the circle centred at this point with radius maxRadius
    let radius = Math.sqrt(Math.random()) * maxRadius;
    let angle = 2 * Math.PI * Math.random();
    return new Vector2f(
      this.x + radius * Math.cos(angle),
      this.y + radius * Math.sin(angle)
    );
  }

  // Returns true if the given point lies to the left of the line from the
  // origin to this vector, otherwise returns false
  isLeftOf(point: Vector2f): boolean {
    return this.x * (point.y - this.y) - this.y * (point.x - this.x) > 0;
  }

  // Returns true if the given point lies to the right of the line from the
  // origin to this vector, otherwise returns false
  isRightOf(point: Vector2f): boolean {
    return this.x * (point.y - this.y) - this.y * (point.x - this.x) < 0;
  }
}
