import { Agent } from "../Agent";
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

  getVelocityObstacle(agent: Agent): VelocityObstacle {
    // Represent circular obstacle as an agent with zero velocity
    const velocityB = new Vector2f(0, 0);

    // Translate origin to the agent's position
    const positionB = this.Position.subtract(agent.getPosition());

    // Find Minkowski sum of agents
    const centre = positionB;
    const radius = this.Radius + agent.Radius;

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
    return new VelocityObstacle(velocityB, tangent1, tangent2);
  }
}
