import { Agent } from "../Agent";
import { Colour } from "../Colour";

export class BasicAgent extends Agent {
  getColour() {
    if (this._isDone) {
      return Colour.White;
    } else {
      return Colour.Green;
    }
  }

  update(deltaT: number): void {
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

    // Step towards goal
    this._direction = preferredVelocity;
    this._position = this._position.add(preferredVelocity.multiply(stepSize));
  }
}
