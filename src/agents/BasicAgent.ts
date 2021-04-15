import { Agent } from "../Agent";
import { Colour } from "../Colour";
import { IObstacle } from "../interfaces/IObstacle";

export class BasicAgent extends Agent {
  getColour() {
    if (this._isDone) {
      return Colour.White;
    } else {
      return Colour.Green;
    }
  }

  update(
    stepSize: number,
    _neighbours: Agent[],
    _obstacles: IObstacle[]
  ): void {
    if (this._isDone) {
      return;
    }

    const preferredVelocity = this._getPreferredVelocity(this._position);

    // Check if done
    if (preferredVelocity.magnitudeSqrd() < 0.1) {
      this._isDone = true;
      return;
    }

    // Step towards goal
    this._direction = preferredVelocity;
    this._position = this._position.add(this._direction.multiply(stepSize));
  }
}
