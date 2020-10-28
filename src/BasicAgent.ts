export class BasicAgent implements IAgent {
  _position: { x: number; y: number };

  constructor(position: { x: number; y: number }) {
    this._position = position;
  }

  getPosition(): { x: number; y: number } {
    return this._position;
  }
}
