import { IObstacle } from "../IObstacle";
import { Vector2f } from "../Vector2f";
import { VelocityObstacle } from "../VelocityObstacle";

export class CircleObstacle implements IObstacle {
  readonly Position: Vector2f;
  readonly Radius: number;

  constructor(position: Vector2f, radius: number) {
    this.Position = position;
    this.Radius = radius;
  }

  getVelocityObstacle(position: Vector2f): VelocityObstacle {
    throw new Error("Method not implemented.");
  }
}
