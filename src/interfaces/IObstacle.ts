import { Agent } from "../Agent";
import { VelocityObstacle } from "../maths/VelocityObstacle";

export interface IObstacle {
  getVelocityObstacle(agent: Agent): VelocityObstacle;
}
