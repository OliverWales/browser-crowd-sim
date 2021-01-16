import { Agent } from "../Agent";
import { Vector2f } from "../Vector2f";
import { Colour } from "../Colour";

export class StopAgent extends Agent {
  private _isStuck: boolean;

  constructor(
    id: number,
    startPosition: Vector2f,
    getPreferredVelocity: (position: Vector2f) => Vector2f
  ) {
    super(id, startPosition, getPreferredVelocity);
    this._isStuck = false;
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

  update(deltaT: number, neighbours: Agent[]): void {
    if (this._isDone) {
      return;
    }

    const goalDirection = this._getPreferredVelocity(this._position);

    // Check if done
    if (goalDirection.x == 0 && goalDirection.y == 0) {
      this._isDone = true;
      return;
    }

    this._direction = goalDirection.normalise();
    const heading = this._position.add(this._direction.multiply(20));

    // Check if stuck
    this._isStuck = false;
    for (var i = 0; i < neighbours.length; i++) {
      if (this.collides(neighbours[i], heading)) {
        this._isStuck = true;
        return;
      }
    }

    // Step towards goal
    this._direction = goalDirection;
    this._position = this._position.add(
      this._direction.multiply((deltaT * 60) / 1000)
    );
  }

  collides(agent: Agent, position: Vector2f): boolean {
    return (
      agent.getPosition().subtract(position).magnitudeSqrd() <
      (agent.Radius + this.Radius) * (agent.Radius + this.Radius)
    );
  }
}
