import { IObstacle } from "../IObstacle";
import { Vector2f } from "../Vector2f";

export class CircleObstacle implements IObstacle {
  readonly Position: Vector2f;
  readonly Radius: number;

  constructor(position: Vector2f, radius: number) {
    this.Position = position;
    this.Radius = radius;
  }
}
