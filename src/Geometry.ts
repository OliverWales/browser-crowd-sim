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

    const distance = ((-b - Math.sqrt(discrim)) / 2) * a;

    return distance;
  }

  static getLineLineIntersection(
    point1: Vector2f,
    direction1: Vector2f,
    point2: Vector2f,
    direction2: Vector2f
  ): Vector2f {
    const diff = point2.subtract(point1).normalise();
    const det = direction2.x * direction1.y - direction2.y * direction1.x;
    const t = (diff.y * direction2.x - diff.y * direction2.y) / det;

    return point1.add(direction1.multiply(t));
  }
}
