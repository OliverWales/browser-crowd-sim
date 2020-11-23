import { IAgent } from "./IAgent";

export class BasicAgent implements IAgent {
  public readonly Id: number;
  public readonly Radius: number;

  private _position: { x: number; y: number };
  private _goalPosition: { x: number; y: number };
  private _direction: { dx: number; dy: number };
  private _isDone: boolean;
  private _isStuck: boolean;

  constructor(
    id: number,
    startPosition: { x: number; y: number },
    goalPosition: { x: number; y: number },
    radius: number
  ) {
    this.Id = id;
    this._position = startPosition;
    this._goalPosition = goalPosition;
    this.Radius = radius;

    this._direction = { dx: 0, dy: 0 };
    this._isDone = false;
  }

  getPosition(): { x: number; y: number } {
    return this._position;
  }

  getDirection(): { dx: number; dy: number } {
    return this._direction;
  }

  getIsDone(): boolean {
    return this._isDone;
  }

  getIsStuck(): boolean {
    return this._isStuck;
  }

  makeStuck() {
    this._isStuck = true;
  }

  update(deltaT: number, _agents: IAgent[]): void {
    if (this._isDone) {
      return;
    }

    let goalDirection = {
      x: this._goalPosition.x - this._position.x,
      y: this._goalPosition.y - this._position.y,
    };
    let goalDistance = Math.sqrt(goalDirection.x ** 2 + goalDirection.y ** 2);

    if (goalDistance > (deltaT * 60) / 1000) {
      this._direction.dx = goalDirection.x / goalDistance;
      this._direction.dy = goalDirection.y / goalDistance;
      this._position.x += ((deltaT * 60) / 1000) * this._direction.dx;
      this._position.y += ((deltaT * 60) / 1000) * this._direction.dy;
    } else {
      this._position.x = this._goalPosition.x;
      this._position.y = this._goalPosition.y;
      this._isDone = true;
    }
  }
}
