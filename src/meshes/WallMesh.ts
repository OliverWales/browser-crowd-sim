import { LineObstacle } from "../obstacles/LineObstacle";
import { Vector2f } from "../Vector2f";

export class WallMesh {
  static getVertices(wall: LineObstacle) {
    const direction = wall.Start.subtract(wall.End);
    const normal = new Vector2f(-direction.y, direction.x).normalise();

    // prettier-ignore
    return [
      // position + normal
      wall.Start.x, wall.Start.y, 0.0, normal.x, normal.y, 0.0,
      wall.End.x,   wall.End.y,   0.0, normal.x, normal.y, 0.0,
      wall.Start.x, wall.Start.y, 1.0, normal.x, normal.y, 0.0,
      wall.End.x,   wall.End.y,   1.0, normal.x, normal.y, 0.0,
    ];
  }

  // prettier-ignore
  static indices = [
      1, 2, 0,
      1, 3, 2,
    ]
}