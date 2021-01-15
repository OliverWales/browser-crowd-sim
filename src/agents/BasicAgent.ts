import { Agent } from "./Agent";
import { Colour } from "../Colour";

export class BasicAgent extends Agent {
  getColour() {
    if (this._isDone) {
      return Colour.White;
    } else {
      return Colour.Green;
    }
  }

  update(deltaT: number, _neighbours: Agent[]): void {
    if (this._isDone) {
      return;
    }

    const goalDirection = this._getPreferredVelocity(this._position);
    const goalDistance = goalDirection.magnitude();

    // Check if done
    if (goalDirection.x == 0 && goalDirection.y == 0) {
      this._isDone = true;
      return;
    }

    // Step towards goal
    this._direction = goalDirection;
    this._position = this._position.add(
      goalDirection.multiply((deltaT * 60) / 1000)
    );
  }
}
