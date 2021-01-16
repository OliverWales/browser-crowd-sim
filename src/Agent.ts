import { Colour } from "./Colour";
import { Vector2f } from "./Vector2f";

export abstract class Agent {
  readonly Radius: number;
  readonly Id: number;

  protected _position: Vector2f;
  protected _direction: Vector2f;
  protected _getPreferredVelocity: (position: Vector2f) => Vector2f;
  protected _isDone: boolean;

  constructor(
    id: number,
    startPosition: Vector2f,
    getPreferredVelocity: (position: Vector2f) => Vector2f
  ) {
    this.Id = id;
    this.Radius = 20;

    this._position = startPosition;
    this._direction = new Vector2f(0, 0);
    this._getPreferredVelocity = getPreferredVelocity;
    this._isDone = false;
  }

  getPosition(): Vector2f {
    return this._position;
  }

  getDirection(): Vector2f {
    return this._direction;
  }

  isDone(): boolean {
    return this._isDone;
  }

  abstract getColour(): Colour;
  abstract update(deltaT: number, neighbours: Agent[]): void;
}
