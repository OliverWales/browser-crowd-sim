import { Vector2f } from "./Vector2f";
import { VelocityObstacle } from "./VelocityObstacle";

export interface IObstacle {
  getVelocityObstacle(position: Vector2f): VelocityObstacle;
}
