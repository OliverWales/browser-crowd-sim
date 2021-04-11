import { Agent } from "../Agent";
import { IObstacle } from "../interfaces/IObstacle";
import { Vector2f } from "../maths/Vector2f";
import { VelocityObstacle } from "../maths/VelocityObstacle";

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

    if (voStart == null && voEnd == null) {
      return null;
    } else if (voStart == null) {
      return voEnd;
    } else if (voEnd == null) {
      return voStart;
    }

    let left = voStart.tangent1;
    if (voStart.tangent2.isLeftOf(left)) {
      left = voStart.tangent2;
    }
    if (voEnd.tangent1.isLeftOf(left)) {
      left = voEnd.tangent1;
    }
    if (voEnd.tangent2.isLeftOf(left)) {
      left = voEnd.tangent2;
    }

    let right = voStart.tangent1;
    if (voStart.tangent2.isRightOf(right)) {
      right = voStart.tangent2;
    }
    if (voEnd.tangent1.isRightOf(right)) {
      right = voEnd.tangent1;
    }
    if (voEnd.tangent2.isRightOf(right)) {
      right = voEnd.tangent2;
    }

    return new VelocityObstacle(new Vector2f(0, 0), left, right);
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
