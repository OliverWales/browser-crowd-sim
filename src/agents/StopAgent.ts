import { Colour } from "../Colour";
import { IAgent } from "../IAgent";
import { Vector2f } from "../Vector2f";

export class StopAgent implements IAgent {
  public readonly Id: number;
  public readonly Radius: number;

  private _position: Vector2f;
  private _goalPosition: Vector2f;
  private _direction: Vector2f;

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

    this._isDone = false;
    this._isStuck = false;
  }

  getPosition(): Vector2f {
    return this._position;
  }

  getDirection(): Vector2f {
    return this._direction;
  }

  getColour(): Colour {
    if (this._isDone) {
      return Colour.White;
    } else if (this._isStuck) {
      return Colour.Red;
    } else {
      return Colour.Green;
    }
  }

  update(deltaT: number, agents: IAgent[]): void {
    if (this._isDone) {
      return;
    }

    let goalDirection = this._goalPosition.subtract(this._position);
    let goalDistance = goalDirection.magnitude();

    if (goalDistance > (deltaT * 60) / 1000) {
      this._direction = goalDirection.normalise();
      let heading = this._position.add(this._direction.multiply(20));

      this._isStuck = false;
      agents.forEach((agent) => {
        if (agent.Id != this.Id && this.collides(agent, heading)) {
          this._isStuck = true;
        }
      });

      if (!this._isStuck) {
        this._position = this._position.add(
          this._direction.multiply((deltaT * 60) / 1000)
        );
      }
    } else {
      this._position = this._goalPosition;
      this._isDone = true;
    }
  }

  isDone(): boolean {
    return this._isDone;
  }

  collides(agent: IAgent, position: Vector2f): boolean {
    return (
      agent.getPosition().subtract(position).magnitude() <
      agent.Radius + this.Radius
    );
  }
}
