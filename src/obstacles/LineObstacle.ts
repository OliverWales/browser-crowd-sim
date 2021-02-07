import { Agent } from "../Agent";
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
  getVelocityObstacle(agent: Agent): VelocityObstacle {
    const voStart = this.pointVelocityObstacle(agent, this.Start);
    const voEnd = this.pointVelocityObstacle(agent, this.End);

    const determinant1 =
      voStart.tangent1.x * voEnd.tangent2.y -
      voStart.tangent1.y * voEnd.tangent2.x;

    const determinant2 =
      voStart.tangent2.x * voEnd.tangent1.y -
      voStart.tangent2.y * voEnd.tangent1.x;

    let tangent1: Vector2f;
    if (determinant1 < 0) {
      tangent1 = voStart.tangent1;
    } else {
      tangent1 = voEnd.tangent1;
    }

    let tangent2: Vector2f;
    if (determinant2 < 0) {
      tangent2 = voStart.tangent2;
    } else {
      tangent2 = voEnd.tangent2;
    }

    return new VelocityObstacle(new Vector2f(0, 0), tangent1, tangent2);
  }

  private pointVelocityObstacle(
    agent: Agent,
    position: Vector2f
  ): VelocityObstacle {
    // Represent circular obstacle as an agent with zero velocity
    const velocityB = new Vector2f(0, 0);

    // Translate origin to the agent's position
    const positionB = position.subtract(agent.getPosition());

    // Find Minkowski sum of agents
    const centre = positionB;
    const radius = agent.Radius;

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
