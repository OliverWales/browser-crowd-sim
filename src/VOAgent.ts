import { IAgent } from "./IAgent";
import { Vector2f } from "./Vector2f";

interface VelocityObstacle {
  // Velocity object defined by a point and two direction vectors
  vertex: Vector2f;
  t1: Vector2f;
  t2: Vector2f;
}

export class VOAgent implements IAgent {
  Radius: number;
  Id: number;

  MAX_VELOCITY = 1.0;
  MAX_ACCELERATION = 0.5;

  private _position: Vector2f;
  private _goalPosition: Vector2f;
  private _direction: Vector2f;

  private _nextPosition: Vector2f;
  private _nextDirection: Vector2f;
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

    this._nextPosition = this._position;
    this._nextDirection = new Vector2f(0, 0);
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
    this._isStuck = false;

    let speed = 0.5;

    if (this._isDone) {
      return;
    }

    let preferredVelocity = this.getPreferredVelocity().multiply(speed);

    let safe = true;
    let collision;
    let agent;
    for (var i = 0; i < neighbours.length; i++) {
      let VO = this.getVelocityObstacle(neighbours[i]);
      if (VO == null || this.isInside(preferredVelocity, VO)) {
        safe = false;
        collision = VO;
        agent = i;
        break;
      }
    }

    // If preferred velocity is safe, go in that direction
    if (safe) {
      this._nextDirection = preferredVelocity;
      this._nextPosition = this._position.add(preferredVelocity);
      if (
        this._nextPosition.subtract(this._goalPosition).magnitudeSqrd() < 0.1
      ) {
        this._isDone = true;
        this._nextPosition = this._goalPosition;
        this._nextDirection = new Vector2f(0, 0);
      }
      return;
    }

    if (collision != null) {
      // Else, consider closest point on first half-plane
      let hp1 = this.getClosestPointOnLine(
        collision.vertex,
        collision.t1,
        preferredVelocity
      );
      safe = true;
      for (var i = 0; i < neighbours.length; i++) {
        if (i != agent) {
          let VO = this.getVelocityObstacle(neighbours[i]);
          if (VO == null || this.isInside(hp1, VO)) {
            safe = false;
            break;
          }
        }
      }

      if (safe) {
        this._nextDirection = hp1;
        this._nextPosition = this._position.add(hp1);
        return;
      }

      // Else, consider closest point on second half-plane
      let hp2 = this.getClosestPointOnLine(
        collision.vertex,
        collision.t2,
        preferredVelocity
      );
      safe = true;
      for (var i = 0; i < neighbours.length; i++) {
        if (i != agent) {
          let VO = this.getVelocityObstacle(neighbours[i]);
          if (VO == null || this.isInside(hp2, VO)) {
            safe = false;
            break;
          }
        }
      }

      if (safe) {
        this._nextDirection = hp2;
        this._nextPosition = this._position.add(hp2);
        return;
      }
    }

    // TODO: Else, sample
    this._nextDirection = new Vector2f(0, 0);
    this._isStuck = true;
    return;
  }

  finalize(): void {
    this._direction = this._nextDirection;
    this._position = this._nextPosition;
  }

  private getPreferredVelocity(): Vector2f {
    let goalDirection = this._goalPosition.subtract(this._position);
    let goalDistance = goalDirection.magnitude();

    if (goalDistance > 1) {
      return goalDirection.divide(goalDistance);
    }
    return goalDirection;
  }

  private getVelocityObstacle(b: IAgent): VelocityObstacle | null {
    let vB = b.getDirection();
    let R = b.Radius + this.Radius; // Radius of Minkowski sum

    // Translate positions as if P_A = (0, 0)
    let pB = b.getPosition().subtract(this.getPosition());

    // Find centre of Minkowski sum
    let pC = pB.add(vB);

    // Calculate angles
    let diff = vB.subtract(pC);
    let dist = diff.magnitude();
    if (dist < R) {
      return null;
    }

    let t = Math.acos(R / dist);
    let d = Math.atan2(diff.y, diff.x);

    // Calculate tangent vectors
    let a1 = d + t;
    let t1 = new Vector2f(pC.x + R * Math.cos(a1), pC.y + R * Math.sin(a1));

    let a2 = d - t;
    let t2 = new Vector2f(pC.x + R * Math.cos(a2), pC.y + R * Math.sin(a2));

    // Return velocity obstacle
    return { vertex: vB, t1: t1, t2: t2 };
  }

  private isInside(velocity: Vector2f, VO: VelocityObstacle): boolean {
    let halfPlane1 =
      (VO.t1.x - VO.vertex.x) * (velocity.y - VO.vertex.y) -
      (VO.t1.y - VO.vertex.y) * (velocity.x - VO.vertex.x);
    let halfPlane2 =
      (VO.t2.x - VO.vertex.x) * (velocity.y - VO.vertex.y) -
      (VO.t2.y - VO.vertex.y) * (velocity.x - VO.vertex.x);

    return halfPlane1 > 0 && halfPlane2 < 0;
  }

  private getClosestPointOnLine(
    linePoint: Vector2f,
    lineDirection: Vector2f,
    point: Vector2f
  ) {
    let direction = lineDirection.normalise();
    let v = point.subtract(linePoint);
    let d = v.dot(direction);
    return linePoint.add(direction.multiply(d));
  }
}
