import { IAgent } from "./IAgent";

export class BasicAgent implements IAgent {
  private _position: { x: number; y: number };
  private _goalPosition: { x: number; y: number };
  public readonly Radius: number;

  private _direction: { dx: number; dy: number };

  constructor(
    position: { x: number; y: number },
    goalPosition: { x: number; y: number },
    radius: number
  ) {
    this._position = position;
    this._goalPosition = goalPosition;
    this.Radius = radius;

    this._direction = { dx: 0, dy: 0 };
  }

  getPosition(): { x: number; y: number } {
    return this._position;
  }

  getDirection(): { dx: number; dy: number } {
    return this._direction;
  }

  update(deltaT: number): void {
    let goalDirection = {
      x: this._goalPosition.x - this._position.x,
      y: this._goalPosition.y - this._position.y,
    };
    let goalDistance = Math.sqrt(goalDirection.x ** 2 + goalDirection.y ** 2);

    if (goalDistance > deltaT / 16) {
      this._direction.dx = goalDirection.x / goalDistance;
      this._direction.dy = goalDirection.y / goalDistance;
      this._position.x += (deltaT / 16) * this._direction.dx;
      this._position.y += (deltaT / 16) * this._direction.dy;
    } else {
      this._position.x = this._goalPosition.x;
      this._position.y = this._goalPosition.y;
    }
  }
}
