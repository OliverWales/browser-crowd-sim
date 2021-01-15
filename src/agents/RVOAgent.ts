import { Colour } from "../Colour";
import { IAgent } from "../IAgent";
import { Vector2f } from "../Vector2f";
import { VelocityObstacle } from "../VelocityObstacle";

export class RVOAgent implements IAgent {
  Radius: number;
  Id: number;

  MAX_VELOCITY = 1.0;
  MAX_ACCELERATION = 0.5;

  private _position: Vector2f;
  private _goalPosition: Vector2f;
  private _direction: Vector2f;

  private _isDone: boolean;
  private _colour: Colour;

  constructor(
    id: number,
    startPosition: Vector2f,
    goalPosition: Vector2f,
    radius: number
  ) {
    this.Id = id;
    this._position = startPosition;
    this._goalPosition = goalPosition;
    this.Radius = radius;
    this._direction = new Vector2f(0, 0);

    this._isDone = false;
    this._colour = Colour.Green;
  }

  getPosition(): Vector2f {
    return this._position;
  }

  getDirection(): Vector2f {
    return this._direction;
  }

  getColour(): Colour {
    return this._colour;
  }

  update(_deltaT: number, neighbours: IAgent[]): void {
    if (this._isDone) {
      return;
    }

    const speed = 0.5;
    const preferredVelocity = this.getPreferredVelocity(speed);
    const goalDistSqrd = this._goalPosition
      .subtract(this.getPosition())
      .magnitudeSqrd();

    let safe = true;
    let collision;
    let agent;
    for (var i = 0; i < neighbours.length; i++) {
      // Skip agents further away than goal
      if (
        neighbours[i]
          .getPosition()
          .subtract(this.getPosition())
          .magnitudeSqrd() > goalDistSqrd
      ) {
        continue;
      }

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
      this._position = this._position.add(preferredVelocity);
      this._colour = Colour.Green;
      this.checkIfDone();
      return;
    }

    if (collision != null) {
      // Else, consider closest point on first half-plane
      const halfPlane1 = this.getClosestPointOnLine(
        collision.vertex,
        collision.tangent1,
        preferredVelocity
      );

      if (halfPlane1.magnitude() <= speed) {
        safe = true;
        for (var i = 0; i < neighbours.length; i++) {
          if (i != agent) {
            const velocityObstacle = this.getReciprocalVelocityObstacle(
              neighbours[i]
            );
            if (
              velocityObstacle != null &&
              velocityObstacle.contains(halfPlane1)
            ) {
              safe = false;
              break;
            }
          }
        }

        if (safe) {
          this._direction = halfPlane1;
          this._position = this._position.add(halfPlane1);
          this.setColour(preferredVelocity);
          this.checkIfDone();
          return;
        }
      }

      // Else, consider closest point on second half-plane
      const halfPlane2 = this.getClosestPointOnLine(
        collision.vertex,
        collision.tangent2,
        preferredVelocity
      );

      if (halfPlane1.magnitude() <= speed) {
        safe = true;
        for (var i = 0; i < neighbours.length; i++) {
          if (i != agent) {
            const velocityObstacle = this.getReciprocalVelocityObstacle(
              neighbours[i]
            );
            if (
              velocityObstacle != null &&
              velocityObstacle.contains(halfPlane2)
            ) {
              safe = false;
              break;
            }
          }
        }

        if (safe) {
          this._direction = halfPlane2;
          this._position = this._position.add(halfPlane2);
          this.setColour(preferredVelocity);
          this.checkIfDone();
          return;
        }
      }
    }

    // Else, sample random velocities and select the one with the least penalty
    const samples = 100; // number of velocities to try
    const w = 100; // parameter for penalty
    const goalDist = Math.sqrt(goalDistSqrd);
    let minPenalty = Infinity;
    let bestVelocity = new Vector2f(0, 0);

    for (var i = 0; i < samples; i++) {
      // Sample velocity from entire allowed velocity space
      const sample = new Vector2f(0, 0).sample(speed);
      let minTimeToCollision = Infinity;

      // Find time to first collision
      for (var j = 0; j < neighbours.length; j++) {
        const b = neighbours[j];
        const velocityObstacle = this.getReciprocalVelocityObstacle(b);
        if (velocityObstacle != null && velocityObstacle.contains(sample)) {
          const timeToCollision = this.getFirstRayCircleIntersection(
            b.getPosition().add(b.getDirection()),
            this.Radius + b.Radius,
            this._position,
            sample
              .multiply(2)
              .subtract(this.getDirection())
              .subtract(b.getDirection())
          );

          if (timeToCollision < minTimeToCollision) {
            minTimeToCollision = timeToCollision;
            if (minTimeToCollision == 0) {
              this.setColour(preferredVelocity);
              this.checkIfDone();
              return;
            }
          }
        }
      }

      // Calculate penalty
      let penalty;
      if (minTimeToCollision < goalDist) {
        penalty =
          w / minTimeToCollision +
          preferredVelocity.subtract(sample).magnitude(); // TS correctly handles divide by zero or infinity
      } else {
        penalty = preferredVelocity.subtract(sample).magnitude();
      }

      if (penalty < minPenalty) {
        minPenalty = penalty;
        bestVelocity = sample;
      }
    }

    this._direction = bestVelocity;
    this._position = this._position.add(bestVelocity);
    this.setColour(preferredVelocity);
    this.checkIfDone();
    return;
  }

  isDone(): boolean {
    return this._isDone;
  }

  private getPreferredVelocity(maxSpeed: number): Vector2f {
    const goalDirection = this._goalPosition.subtract(this._position);
    const goalDistance = goalDirection.magnitude();

    if (goalDistance > maxSpeed) {
      return goalDirection.divide(goalDistance / maxSpeed);
    }
    return goalDirection;
  }

  private getReciprocalVelocityObstacle(b: IAgent): VelocityObstacle | null {
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

  private getClosestPointOnLine(
    linePoint: Vector2f,
    lineDirection: Vector2f,
    point: Vector2f
  ): Vector2f {
    const direction = lineDirection.normalise();
    const vector = point.subtract(linePoint);
    const distance = vector.dot(direction);
    return linePoint.add(direction.multiply(distance));
  }

  private getFirstRayCircleIntersection(
    centre: Vector2f,
    radius: number,
    origin: Vector2f,
    direction: Vector2f
  ): number {
    const delta = origin.subtract(centre);

    const a = direction.dot(direction);
    const b = 2 * direction.dot(delta);
    const c = delta.dot(delta) - radius ** 2;

    const discrim = b ** 2 - 4 * a * c;

    if (discrim < 0) {
      // No intersection
      return Infinity;
    }

    const distance = ((-b - Math.sqrt(discrim)) / 2) * a;

    if (distance < 0) {
      // Intersection behind
      return Infinity;
    }

    return distance;
  }

  private setColour(preferredVelocity: Vector2f) {
    const stress = preferredVelocity.subtract(this._direction).magnitude();
    this._colour = Colour.FromHsv((1 - stress) / 3, 1, 1);
  }

  private checkIfDone() {
    const finishThreshold = 1.0;

    if (
      this._position.subtract(this._goalPosition).magnitudeSqrd() <
      finishThreshold
    ) {
      this._isDone = true;
      this._position = this._goalPosition;
      this._direction = new Vector2f(0, 0);
      this._colour = Colour.White;
    }
  }
}
