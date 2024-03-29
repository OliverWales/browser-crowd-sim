import { Colour } from "./Colour";
import { IObstacle } from "./interfaces/IObstacle";
import { Vector2f } from "./maths/Vector2f";

export abstract class Agent {
  readonly Radius: number;
  readonly Id: number;

  protected _position: Vector2f;
  protected _direction: Vector2f;
  protected _goalPosition: Vector2f;
  protected _getPreferredVelocity: (position: Vector2f) => Vector2f;
  protected _isDone: boolean;

  constructor(
    id: number,
    startPosition: Vector2f,
    goalPosition: Vector2f,
    getPreferredVelocity: (position: Vector2f) => Vector2f
  ) {
    this.Id = id;
    this.Radius = 20;

    this._position = startPosition;
    this._direction = getPreferredVelocity(startPosition); // Start pointing in goal direction
    this._goalPosition = goalPosition;
    this._getPreferredVelocity = getPreferredVelocity;
    this._isDone = false;
  }

  getPosition(): Vector2f {
    return this._position;
  }

  getDirection(): Vector2f {
    return this._direction;
  }

  getDistanceToGoal(): number {
    return this._position.subtract(this._goalPosition).magnitude();
  }

  isDone(): boolean {
    return this._isDone;
  }

  abstract getColour(): Colour;
  abstract update(
    deltaT: number,
    neighbours: Agent[],
    obstacles: IObstacle[]
  ): void;
}
