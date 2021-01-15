import { Agent } from "./Agent";
import { Colour } from "../Colour";
import { Geometry } from "../Geometry";
import { Vector2f } from "../Vector2f";
import { VelocityObstacle } from "../VelocityObstacle";

export class RVOAgent extends Agent {
  private _colour: Colour;

  constructor(
    id: number,
    startPosition: Vector2f,
    getPreferredVelocity: (position: Vector2f) => Vector2f
  ) {
    super(id, startPosition, getPreferredVelocity);
    this._colour = Colour.Green;
  }

  getColour(): Colour {
    return this._colour;
  }

  update(deltaT: number, neighbours: Agent[]): void {
    if (this._isDone) {
      return;
    }

    const preferredVelocity = this._getPreferredVelocity(this._position);

    // Check if done
    if (preferredVelocity.x == 0 && preferredVelocity.y == 0) {
      this._isDone = true;
      this._direction = new Vector2f(0, 0);
      this._colour = Colour.White;
      return;
    }

    let safe = true;
    let collision;
    let agent;

    for (var i = 0; i < neighbours.length; i++) {
      // Check whether preferred velocity is safe
      const velocityObstacle = this.getReciprocalVelocityObstacle(
        neighbours[i]
      );
      if (
        velocityObstacle != null &&
        velocityObstacle.contains(preferredVelocity)
      ) {
        safe = false;
        collision = velocityObstacle;
        agent = i;
        break;
      }
    }

    // If preferred velocity is safe, go in that direction
    if (safe) {
      this._direction = preferredVelocity;
      this._position = this._position.add(
        this._direction.multiply((deltaT * 60) / 1000)
      );
      this._colour = Colour.Green;
      return;
    }

    // If not, try closest point on left and right edge of cone
    if (collision != null) {
      const left = Geometry.getClosestPointOnLine(
        collision.vertex,
        collision.tangent1,
        preferredVelocity
      );

      const right = Geometry.getClosestPointOnLine(
        collision.vertex,
        collision.tangent2,
        preferredVelocity
      );

      let leftSafe = true;
      let rightSafe = true;

      for (var i = 0; i < neighbours.length; i++) {
        if (i != agent) {
          const velocityObstacle = this.getReciprocalVelocityObstacle(
            neighbours[i]
          );
          if (velocityObstacle != null && velocityObstacle.contains(left)) {
            leftSafe = false;
          }
          if (velocityObstacle != null && velocityObstacle.contains(left)) {
            rightSafe = false;
          }
        }
      }

      if (leftSafe && rightSafe) {
        // If both are safe take closest to preferred velocity
        if (
          left.subtract(preferredVelocity).magnitudeSqrd() <
          right.subtract(preferredVelocity).magnitudeSqrd()
        ) {
          this._direction = left;
        } else {
          this._direction = right;
        }
      } else if (leftSafe) {
        this._direction = left;
      } else if (rightSafe) {
        this._direction = right;
      }

      if (leftSafe || rightSafe) {
        this._position = this._position.add(
          this._direction.multiply((deltaT * 60) / 1000)
        );
        this.setColour(preferredVelocity);
        return;
      }
    }

    // Else, sample random velocities and select the one with the least penalty
    const samples = 100; // number of velocities to try
    const w = 100; // parameter for penalty
    let minPenalty = Infinity;
    let bestVelocity = new Vector2f(0, 0);

    for (var i = 0; i < samples; i++) {
      // Sample velocity from entire allowed velocity space
      const sample = new Vector2f(0, 0).sample(1);
      let minTimeToCollision = Infinity;

      // Find time to first collision
      for (var j = 0; j < neighbours.length; j++) {
        const b = neighbours[j];
        const velocityObstacle = this.getReciprocalVelocityObstacle(b);

        if (velocityObstacle == null || velocityObstacle.contains(sample)) {
          const timeToCollision = Geometry.getFirstRayCircleIntersection(
            b.getPosition().add(b.getDirection()),
            this.Radius + b.Radius,
            this._position,
            sample.subtract(b.getDirection())
          );

          if (timeToCollision < minTimeToCollision) {
            minTimeToCollision = timeToCollision;
          }
        }
      }

      // Calculate penalty
      const penalty =
        w / minTimeToCollision + preferredVelocity.subtract(sample).magnitude(); // TS correctly handles divide by zero or infinity

      if (penalty < minPenalty) {
        minPenalty = penalty;
        bestVelocity = sample;
      }
    }

    this._direction = bestVelocity;
    this._position = this._position.add(
      this._direction.multiply((deltaT * 60) / 1000)
    );
    this.setColour(preferredVelocity);
    return;
  }

  private getReciprocalVelocityObstacle(b: Agent): VelocityObstacle | null {
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

  private setColour(preferredVelocity: Vector2f) {
    const stress = preferredVelocity.subtract(this._direction).magnitude();
    this._colour = Colour.FromHsv((1 - stress) / 3, 1, 1);
  }
}
