import { Agent } from "../Agent";
import { VOAgent } from "./VOAgent";
import { Vector2f } from "../maths/Vector2f";
import { VelocityObstacle } from "../maths/VelocityObstacle";

export class RVOAgent extends VOAgent {
  // Override getVelocityObstacle to produce Reciprocal Velocity Obstacle
  protected getAgentVelocityObstacle(b: Agent): VelocityObstacle | null {
    const velocityA = this.getDirection();
    const velocityB = b.getDirection();
    const vertex = velocityA.add(velocityB).divide(2);

    // Translate origin to this agent's position
    const positionB = b.getPosition().subtract(this._position);

    // Find Minkowski sum of agents
    const centre = positionB.add(velocityB);
    const radius = b.Radius + this.Radius;

    // Calculate angles
    const diff = velocityB.subtract(centre);
    const dist = diff.magnitude();
    if (dist < radius) {
      return null;
    }

    const theta = Math.acos(radius / dist);
    const phi = Math.atan2(diff.y, diff.x);

    // Calculate tangent vectors
    const angle1 = phi + theta;
    const tangent1 = new Vector2f(
      centre.x + radius * Math.cos(angle1),
      centre.y + radius * Math.sin(angle1)
    );

    const angle2 = phi - theta;
    const tangent2 = new Vector2f(
      centre.x + radius * Math.cos(angle2),
      centre.y + radius * Math.sin(angle2)
    );

    // Return velocity obstacle
    return new VelocityObstacle(vertex, tangent1, tangent2);
  }
}
