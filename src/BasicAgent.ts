import { IAgent } from "./IAgent";

export class BasicAgent implements IAgent {
  private _position: { x: number; y: number };

  constructor(position: { x: number; y: number }) {
    this._position = position;
  }

  getPosition(): { x: number; y: number } {
    return this._position;
  }

  update(deltaT: number): void {
    this._position.x += deltaT / 10;
    if (this._position.x > 500) {
      this._position.x = 0;
    }
  }
}
