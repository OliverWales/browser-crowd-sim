import { Agent } from "./Agent";
import { VelocityObstacle } from "./VelocityObstacle";

export interface IObstacle {
  getVelocityObstacle(agent: Agent): VelocityObstacle;
}
