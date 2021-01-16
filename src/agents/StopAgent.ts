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

    const preferredVelocity = this._getPreferredVelocity(this._position);
    const stepSize = (deltaT * 60) / 3000;

    // Check if done
    if (preferredVelocity.magnitudeSqrd() < 0.1) {
      this._isDone = true;
      return;
    }

    this._direction = preferredVelocity.normalise();
    const heading = this._position.add(this._direction.multiply(25));

    // Check if stuck
    this._isStuck = false;
    for (var i = 0; i < neighbours.length; i++) {
      if (this.collides(neighbours[i], heading)) {
        this._isStuck = true;
        return;
      }
    }

    // Step towards goal
    this._direction = preferredVelocity;
    this._position = this._position.add(this._direction.multiply(stepSize));
  }

  collides(agent: Agent, position: Vector2f): boolean {
    return (
      agent.getPosition().subtract(position).magnitudeSqrd() <
      (agent.Radius + this.Radius) * (agent.Radius + this.Radius)
    );
  }
}
