import { Vector2f } from "./Vector2f";

export class Geometry {
  static getClosestPointOnLine(
    linePoint: Vector2f,
    lineDirection: Vector2f,
    point: Vector2f
  ): Vector2f {
    const direction = lineDirection.normalise();
    const vector = point.subtract(linePoint);
    const distance = vector.dot(direction);

    return linePoint.add(direction.multiply(distance));
  }

  static getFirstRayCircleIntersection(
    centre: Vector2f,
    radius: number,
    origin: Vector2f,
    direction: Vector2f
  ): number {
    const delta = origin.subtract(centre);

    const a = direction.dot(direction);
    const b = 2 * direction.dot(delta);
    const c = delta.dot(delta) - radius ** 2;

    const discrim = b ** 2 - 4 * a * c;

    if (discrim < 0) {
      // No intersection
      return Infinity;
    }

    const sqrtDiscrim = Math.sqrt(discrim);

    const d1 = (-b - sqrtDiscrim) / (2 * a);

    if (d1 > 0) {
      return d1;
    }

    const d2 = (-b + sqrtDiscrim) / (2 * a);

    if (d2 > 0) {
      return d2;
    }

    return Infinity;
  }

  static getLineLineIntersection(
    a1: Vector2f,
    a2: Vector2f,
    b1: Vector2f,
    b2: Vector2f
  ): Vector2f {
    const d = (a1.x - a2.x) * (b1.y - b2.y) - (a1.y - a2.y) * (b1.x - b2.x);
    const u =
      ((a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x)) / d;

    return new Vector2f(b1.x + u * (b2.x - b1.x), b1.y + u * (b2.y - b1.y));
  }
}
