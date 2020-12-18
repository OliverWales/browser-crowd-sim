import { IAgent } from "./IAgent";
import { Vector2f } from "./Vector2f";

interface VelocityObstacle {
  // Velocity object defined by a point and two direction vectors
  vertex: Vector2f;
  tangent1: Vector2f;
  tangent2: Vector2f;
}

export class RVOAgent implements IAgent {
  Radius: number;
  Id: number;

  MAX_VELOCITY = 1.0;
  MAX_ACCELERATION = 0.5;

  private _position: Vector2f;
  private _goalPosition: Vector2f;
  private _direction: Vector2f;

  private _isDone: boolean;
  private _isStuck: boolean;

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
    this._isStuck = false;
  }

  getPosition(): Vector2f {
    return this._position;
  }

  getDirection(): Vector2f {
    return this._direction;
  }

  getIsDone(): boolean {
    return this._isDone;
  }

  getIsStuck(): boolean {
    return this._isStuck;
  }

  update(deltaT: number, neighbours: IAgent[]): void {
    if (this._isDone) {
      return;
    }

    this._isStuck = false;
    let speed = 0.5;
    let preferredVelocity = this.getPreferredVelocity(speed);

    let safe = true;
    let collision;
    let agent;
    for (var i = 0; i < neighbours.length; i++) {
      let velocityObstacle = this.getReciprocalVelocityObstacle(neighbours[i]);
      if (
        velocityObstacle != null &&
        this.isInside(preferredVelocity, velocityObstacle)
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
      this.checkIfDone();
      return;
    }

    if (collision != null) {
      // Else, consider closest point on first half-plane
      let halfplane1 = this.getClosestPointOnLine(
        collision.vertex,
        collision.tangent1,
        preferredVelocity
      );

      if (halfplane1.magnitude() <= speed) {
        safe = true;
        for (var i = 0; i < neighbours.length; i++) {
          if (i != agent) {
            let velocityObstacle = this.getReciprocalVelocityObstacle(
              neighbours[i]
            );
            if (
              velocityObstacle != null &&
              this.isInside(halfplane1, velocityObstacle)
            ) {
              safe = false;
              break;
            }
          }
        }

        if (safe) {
          this._direction = halfplane1;
          this._position = this._position.add(halfplane1);
          this.checkIfDone();
          return;
        }
      }

      // Else, consider closest point on second half-plane
      let halfPlane2 = this.getClosestPointOnLine(
        collision.vertex,
        collision.tangent2,
        preferredVelocity
      );

      if (halfplane1.magnitude() <= speed) {
        safe = true;
        for (var i = 0; i < neighbours.length; i++) {
          if (i != agent) {
            let velocityObstacle = this.getReciprocalVelocityObstacle(
              neighbours[i]
            );
            if (
              velocityObstacle != null &&
              this.isInside(halfPlane2, velocityObstacle)
            ) {
              safe = false;
              break;
            }
          }
        }

        if (safe) {
          this._direction = halfPlane2;
          this._position = this._position.add(halfPlane2);
          this.checkIfDone();
          return;
        }
      }
    }

    // Else, sample random velocities and select the one with the least penalty
    let samples = 100; // number of velocities to try
    let w = 100; // parameter for penalty
    let minPenalty = Infinity;
    let bestVelocity = new Vector2f(0, 0);

    for (var i = 0; i < samples; i++) {
      // Sample velocity from entire allowed velocity space
      let sample = new Vector2f(0, 0).sample(speed);
      let minTimeToCollision = Infinity;

      // Find time to first collision
      for (var j = 0; j < neighbours.length; j++) {
        let b = neighbours[j];
        let velocityObstacle = this.getReciprocalVelocityObstacle(b);
        if (
          velocityObstacle != null &&
          this.isInside(sample, velocityObstacle)
        ) {
          let timeToCollision = this.getFirstRayCircleIntersection(
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
              this.checkIfDone();
              return;
            }
          }
        }
      }

      // Calculate penalty
      let penalty =
        w / minTimeToCollision + preferredVelocity.subtract(sample).magnitude(); // TS correctly handles divide by zero or infinity
      if (penalty < minPenalty) {
        minPenalty = penalty;
        bestVelocity = sample;
      }
    }

    if (bestVelocity.magnitude() == 0) {
      this._isStuck = true;
    }

    this._direction = bestVelocity;
    this._position = this._position.add(bestVelocity);
    this.checkIfDone();
    return;
  }

  private getPreferredVelocity(maxSpeed: number): Vector2f {
    let goalDirection = this._goalPosition.subtract(this._position);
    let goalDistance = goalDirection.magnitude();

    if (goalDistance > maxSpeed) {
      return goalDirection.divide(goalDistance / maxSpeed);
    }
    return goalDirection;
  }

  private getReciprocalVelocityObstacle(b: IAgent): VelocityObstacle | null {
    let velocityA = this.getDirection();
    let velocityB = b.getDirection();
    let vertex = velocityA.add(velocityB).divide(2);

    // Translate origin to this agent's position
    let positionB = b.getPosition().subtract(this._position);

    // Find Minkowski sum of agents
    let centre = positionB.add(velocityB);
    let radius = b.Radius + this.Radius;

    // Calculate angles
    let diff = velocityB.subtract(centre);
    let dist = diff.magnitude();
    if (dist < radius) {
      return null;
    }

    let theta = Math.acos(radius / dist);
    let phi = Math.atan2(diff.y, diff.x);

    // Calculate tangent vectors
    let angle1 = phi + theta;
    let tangent1 = new Vector2f(
      centre.x + radius * Math.cos(angle1),
      centre.y + radius * Math.sin(angle1)
    );

    let angle2 = phi - theta;
    let tangent2 = new Vector2f(
      centre.x + radius * Math.cos(angle2),
      centre.y + radius * Math.sin(angle2)
    );

    // Return velocity obstacle
    return { vertex: vertex, tangent1: tangent1, tangent2: tangent2 };
  }

  private isInside(
    velocity: Vector2f,
    velocityObstacle: VelocityObstacle
  ): boolean {
    // First half-plane
    let determinant1 =
      (velocityObstacle.tangent1.x - velocityObstacle.vertex.x) *
        (velocity.y - velocityObstacle.vertex.y) -
      (velocityObstacle.tangent1.y - velocityObstacle.vertex.y) *
        (velocity.x - velocityObstacle.vertex.x);

    // Second half-plane
    let determinant2 =
      (velocityObstacle.tangent2.x - velocityObstacle.vertex.x) *
        (velocity.y - velocityObstacle.vertex.y) -
      (velocityObstacle.tangent2.y - velocityObstacle.vertex.y) *
        (velocity.x - velocityObstacle.vertex.x);

    return determinant1 > 0 && determinant2 < 0;
  }

  private getClosestPointOnLine(
    linePoint: Vector2f,
    lineDirection: Vector2f,
    point: Vector2f
  ): Vector2f {
    let direction = lineDirection.normalise();
    let vector = point.subtract(linePoint);
    let distance = vector.dot(direction);
    return linePoint.add(direction.multiply(distance));
  }

  private getFirstRayCircleIntersection(
    centre: Vector2f,
    radius: number,
    origin: Vector2f,
    direction: Vector2f
  ): number {
    let delta = origin.subtract(centre);

    let a = direction.dot(direction);
    let b = 2 * direction.dot(delta);
    let c = delta.dot(delta) - radius ** 2;

    let discrim = b ** 2 - 4 * a * c;

    if (discrim < 0) {
      // No intersection
      return Infinity;
    }

    let distance = ((-b - Math.sqrt(discrim)) / 2) * a;

    if (distance < 0) {
      // Intersection behind
      return Infinity;
    }

    return distance;
  }

  private checkIfDone() {
    let finishThreshold = 1.0;

    if (
      this._position.subtract(this._goalPosition).magnitudeSqrd() <
      finishThreshold
    ) {
      this._isDone = true;
      this._position = this._goalPosition;
      this._direction = new Vector2f(0, 0);
    }
  }
}
