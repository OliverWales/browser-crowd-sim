import { IAgent } from "./IAgent";
import { Vector2f } from "./Vector2f";

export class BasicAgent implements IAgent {
  public readonly Id: number;
  public readonly Radius: number;

  private _position: Vector2f;
  private _goalPosition: Vector2f;
  private _direction: Vector2f;

  private _isDone: boolean;

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
    // This agent cannot get stuck
    return false;
  }

  update(deltaT: number, _agents: IAgent[]): void {
    if (this._isDone) {
      return;
    }

    let goalDirection = this._goalPosition.subtract(this._position);
    let goalDistance = goalDirection.magnitude();

    if (goalDistance > (deltaT * 60) / 1000) {
      this._direction = goalDirection.normalise();
      this._position = this._position.add(
        this._direction.multiply((deltaT * 60) / 1000)
      );
    } else {
      this._position = this._goalPosition;
      this._isDone = true;
    }
  }
}
