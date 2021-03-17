import { Agent } from "../Agent";
import { Colour } from "../Colour";
import { Geometry } from "../Geometry";
import { IObstacle } from "../IObstacle";
import { CircleObstacle } from "../obstacles/CircleObstacle";
import { LineObstacle } from "../obstacles/LineObstacle";
import { Vector2f } from "../Vector2f";
import { VelocityObstacle } from "../VelocityObstacle";

export class VOAgent extends Agent {
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

  update(deltaT: number, neighbours: Agent[], obstacles: IObstacle[]): void {
    if (this._isDone) {
      return;
    }

    const preferredVelocity = this._getPreferredVelocity(this._position);
    const stepSize = (deltaT * 60) / 4000;

    // Check if done
    if (preferredVelocity.magnitudeSqrd() < 0.1) {
      this._isDone = true;
      this._direction = new Vector2f(0, 0);
      this._colour = Colour.White;
      return;
    }

    let safe = true;
    let collision;
    let agent;

    // Check for collision with neighbouring agents
    for (var i = 0; i < neighbours.length; i++) {
      const velocityObstacle = this.getAgentVelocityObstacle(neighbours[i]);
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

    // Check for collision with obstacles
    for (var i = 0; i < obstacles.length; i++) {
      const velocityObstacle = obstacles[i].getVelocityObstacle(this);
      if (
        velocityObstacle != null &&
        velocityObstacle.contains(preferredVelocity)
      ) {
        safe = false;
        collision = velocityObstacle;
        agent = -1; // not colliding with an agent
        break;
      }
    }

    // If preferred velocity is safe, go in that direction
    if (safe) {
      this._direction = preferredVelocity;
      this._position = this._position.add(this._direction.multiply(stepSize));
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

      // Check for collision with neighbouring agents
      for (var i = 0; i < neighbours.length; i++) {
        if (i != agent) {
          const velocityObstacle = this.getAgentVelocityObstacle(neighbours[i]);
          if (velocityObstacle != null && velocityObstacle.contains(left)) {
            leftSafe = false;
          }
          if (velocityObstacle != null && velocityObstacle.contains(left)) {
            rightSafe = false;
          }
        }
      }

      // Check for collision with obstacles
      for (var i = 0; i < obstacles.length; i++) {
        const velocityObstacle = obstacles[i].getVelocityObstacle(this);
        if (velocityObstacle != null && velocityObstacle.contains(left)) {
          leftSafe = false;
        }
        if (velocityObstacle != null && velocityObstacle.contains(left)) {
          rightSafe = false;
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
        this._position = this._position.add(this._direction.multiply(stepSize));
        this.setColour(preferredVelocity);
        return;
      }
    }

    // Else, sample random velocities and select the one with the least penalty
    const samples = 100; // number of velocities to try
    const w = 200; // parameter for penalty
    let minPenalty = Infinity;
    let bestVelocity = new Vector2f(0, 0);

    for (var i = 0; i < samples; i++) {
      // Sample velocity from entire allowed velocity space
      const sample = new Vector2f(0, 0).sample(1);
      let minTimeToCollision = Infinity;

      // Find time to first collision with another agent
      for (var j = 0; j < neighbours.length; j++) {
        const b = neighbours[j];
        const velocityObstacle = this.getAgentVelocityObstacle(b);

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

      // Find time to first collision with an obstacle
      for (var j = 0; j < obstacles.length; j++) {
        const b = obstacles[j];
        if (b instanceof CircleObstacle) {
          const velocityObstacle = b.getVelocityObstacle(this);

          if (velocityObstacle == null || velocityObstacle.contains(sample)) {
            const timeToCollision = Geometry.getFirstRayCircleIntersection(
              b.Position,
              this.Radius + b.Radius,
              this._position,
              sample
            );

            if (timeToCollision < minTimeToCollision) {
              minTimeToCollision = timeToCollision;
            }
          }
        } else if (b instanceof LineObstacle) {
          const timeToCollision =
            Geometry.getLineLineIntersection(
              b.Start,
              b.End,
              this._position,
              this._position.add(sample.normalise().multiply(this.Radius))
            )
              .subtract(this._position)
              .magnitude() / sample.magnitude();

          if (timeToCollision < minTimeToCollision) {
            minTimeToCollision = timeToCollision;
          }
        }
      }

      // Attempt to prevent intersection
      if (minTimeToCollision < 10) {
        minTimeToCollision = 0;
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
    this._position = this._position.add(this._direction.multiply(stepSize));
    this.setColour(preferredVelocity);
    return;
  }

  protected getAgentVelocityObstacle(b: Agent): VelocityObstacle | null {
    const velocityB = b.getDirection();

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
    return new VelocityObstacle(velocityB, tangent1, tangent2);
  }

  protected setColour(preferredVelocity: Vector2f) {
    const stress = preferredVelocity.subtract(this._direction).magnitude();
    const hue = stress > 1 ? 0 : (1 - stress) / 3;
    this._colour = Colour.FromHsv(hue, 1, 1);
  }
}
