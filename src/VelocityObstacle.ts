import { Vector2f } from "./Vector2f";

export class VelocityObstacle {
  vertex: Vector2f;
  tangent1: Vector2f;
  tangent2: Vector2f;

  constructor(vertex: Vector2f, tangent1: Vector2f, tangent2: Vector2f) {
    this.vertex = vertex;
    this.tangent1 = tangent1;
    this.tangent2 = tangent2;
  }

  contains(velocity: Vector2f): boolean {
    // First half-plane
    const determinant1 =
      (this.tangent1.x - this.vertex.x) * (velocity.y - this.vertex.y) -
      (this.tangent1.y - this.vertex.y) * (velocity.x - this.vertex.x);

    // Second half-plane
    const determinant2 =
      (this.tangent2.x - this.vertex.x) * (velocity.y - this.vertex.y) -
      (this.tangent2.y - this.vertex.y) * (velocity.x - this.vertex.x);

    return determinant1 > 0 && determinant2 < 0;
  }
}
