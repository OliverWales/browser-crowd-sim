import { Agent } from "../Agent";
import { VOAgent } from "./VOAgent";
import { Geometry } from "../Geometry";
import { Vector2f } from "../Vector2f";
import { VelocityObstacle } from "../VelocityObstacle";

export class HRVOAgent extends VOAgent {
  // Override getVelocityObstacle to produce Hybrid Reciprocal Velocity Obstacle
  protected getAgentVelocityObstacle(b: Agent): VelocityObstacle | null {
    const velocityA = this.getDirection();
    const velocityB = b.getDirection();

    // Get respective vertices
    const voVertex = velocityB;
    const rvoVertex = velocityA.add(velocityB).divide(2);

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

    // Check which side to pass on
    const side =
      (positionB.x - velocityB.x) * (velocityA.y - velocityB.y) -
      (positionB.y - velocityB.y) * (velocityA.x - velocityB.x);

    // Calculate vertex as intersection of VO and RVO cone
    let vertex;
    if (side > 0) {
      // "Left"
      vertex = Geometry.getLineLineIntersection(
        voVertex,
        voVertex.add(tangent1),
        rvoVertex,
        rvoVertex.add(tangent2)
      );
    } else {
      // "Right"
      vertex = Geometry.getLineLineIntersection(
        voVertex,
        voVertex.add(tangent2),
        rvoVertex,
        rvoVertex.add(tangent1)
      );
    }

    // Return hybrid recipricol velocity obstacle
    return new VelocityObstacle(vertex, tangent1, tangent2);
  }
}
