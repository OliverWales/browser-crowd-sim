import { Colour } from "../Colour";
import { IAgent } from "../IAgent";
import { Vector2f } from "../Vector2f";
import { VelocityObstacle } from "../VelocityObstacle";

export class HRVOAgent implements IAgent {
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

    // TODO: Implement HRVO algorithm
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

  private getHybridReciprocalVelocityObstacle(
    b: IAgent
  ): VelocityObstacle | null {
    throw new Error("Method not implemented.");
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
