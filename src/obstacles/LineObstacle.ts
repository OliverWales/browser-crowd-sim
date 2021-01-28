import { IObstacle } from "../IObstacle";
import { Vector2f } from "../Vector2f";
import { VelocityObstacle } from "../VelocityObstacle";

export class LineObstacle implements IObstacle {
  readonly Start: Vector2f;
  readonly End: Vector2f;

  constructor(start: Vector2f, end: Vector2f) {
    this.Start = start;
    this.End = end;
  }

  getVelocityObstacle(position: Vector2f): VelocityObstacle {
    throw new Error("Method not implemented.");
  }
}
