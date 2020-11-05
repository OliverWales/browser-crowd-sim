import { IAgent } from "./IAgent";

export class BasicAgent implements IAgent {
  private _position: { x: number; y: number };
  private _direction: { dx: number; dy: number };
  public readonly Radius: number;

  constructor(
    position: { x: number; y: number },
    direction: { dx: number; dy: number },
    radius: number
  ) {
    this._position = position;
    this._direction = direction;
    this.Radius = radius;
  }

  getPosition(): { x: number; y: number } {
    return this._position;
  }

  getDirection(): { dx: number; dy: number } {
    return this._direction;
  }

  update(deltaT: number): void {
    this._position.x += this._direction.dx;
    this._position.y += this._direction.dy;

    if (this._position.x > 1280) {
      this._position.x = 0;
    }
    if (this._position.y > 720) {
      this._position.y = 0;
    }
    if (this._position.x < 0) {
      this._position.x = 1280;
    }
    if (this._position.y < 0) {
      this._position.y = 720;
    }
  }
}
