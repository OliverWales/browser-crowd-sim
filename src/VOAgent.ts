import { IAgent } from "./IAgent";
import { Vector2f } from "./Vector2f";

interface VelocityObstacle {
  // Velocity object defined by a point and two direction vectors
  vertex: Vector2f;
  tangent1: Vector2f;
  tangent2: Vector2f;
}

export class VOAgent implements IAgent {
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

    const speed = 0.5;
    const preferredVelocity = this.getPreferredVelocity(speed);
    const goalDistSqrd = this._goalPosition
      .subtract(this.getPosition())
      .magnitudeSqrd();

    this._isStuck = false;
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
      const velocityObstacle = this.getVelocityObstacle(neighbours[i]);
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
      const halfplane1 = this.getClosestPointOnLine(
        collision.vertex,
        collision.tangent1,
        preferredVelocity
      );

      if (halfplane1.magnitude() <= speed) {
        safe = true;
        for (var i = 0; i < neighbours.length; i++) {
          if (i != agent) {
            const velocityObstacle = this.getVelocityObstacle(neighbours[i]);
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
      const halfPlane2 = this.getClosestPointOnLine(
        collision.vertex,
        collision.tangent2,
        preferredVelocity
      );

      if (halfplane1.magnitude() <= speed) {
        safe = true;
        for (var i = 0; i < neighbours.length; i++) {
          if (i != agent) {
            const velocityObstacle = this.getVelocityObstacle(neighbours[i]);
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
        const velocityObstacle = this.getVelocityObstacle(b);
        if (
          velocityObstacle == null ||
          this.isInside(sample, velocityObstacle)
        ) {
          const timeToCollision = this.getFirstRayCircleIntersection(
            b.getPosition().add(b.getDirection()),
            this.Radius + b.Radius,
            this._position,
            sample.subtract(b.getDirection())
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

    if (bestVelocity.magnitude() == 0) {
      this._isStuck = true;
    }

    this._direction = bestVelocity;
    this._position = this._position.add(bestVelocity);
    this.checkIfDone();
    return;
  }

  private getPreferredVelocity(maxSpeed: number): Vector2f {
    const goalDirection = this._goalPosition.subtract(this._position);
    const goalDistance = goalDirection.magnitude();

    if (goalDistance > maxSpeed) {
      return goalDirection.divide(goalDistance / maxSpeed);
    }
    return goalDirection;
  }

  private getVelocityObstacle(b: IAgent): VelocityObstacle | null {
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
    return { vertex: velocityB, tangent1: tangent1, tangent2: tangent2 };
  }

  private isInside(
    velocity: Vector2f,
    velocityObstacle: VelocityObstacle
  ): boolean {
    // First half-plane
    const determinant1 =
      (velocityObstacle.tangent1.x - velocityObstacle.vertex.x) *
        (velocity.y - velocityObstacle.vertex.y) -
      (velocityObstacle.tangent1.y - velocityObstacle.vertex.y) *
        (velocity.x - velocityObstacle.vertex.x);

    // Second half-plane
    const determinant2 =
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

  private checkIfDone() {
    const finishThreshold = 1.0;

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
