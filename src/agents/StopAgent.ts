import { Agent } from "../Agent";
import { Vector2f } from "../Vector2f";
import { Colour } from "../Colour";
import { IObstacle } from "../IObstacle";
import { CircleObstacle } from "../obstacles/CircleObstacle";

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

  update(deltaT: number, neighbours: Agent[], obstacles: IObstacle[]): void {
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

    // Check if blocked by another agent
    this._isStuck = false;
    for (var i = 0; i < neighbours.length; i++) {
      if (this.collidesAgent(neighbours[i], heading)) {
        this._isStuck = true;
        return;
      }
    }

    // Check if blocked by an obstacle
    for (var i = 0; i < obstacles.length; i++) {
      if (this.collidesObstacle(obstacles[i], heading)) {
        this._isStuck = true;
        return;
      }
    }

    // Step towards goal
    this._direction = preferredVelocity;
    this._position = this._position.add(this._direction.multiply(stepSize));
  }

  collidesAgent(agent: Agent, position: Vector2f): boolean {
    return (
      agent.getPosition().subtract(position).magnitudeSqrd() <
      (agent.Radius + this.Radius) * (agent.Radius + this.Radius)
    );
  }

  collidesObstacle(obstacle: IObstacle, position: Vector2f): boolean {
    if (obstacle instanceof CircleObstacle) {
      return (
        obstacle.Position.subtract(position).magnitudeSqrd() <
        (obstacle.Radius + this.Radius) * (obstacle.Radius + this.Radius)
      );
    } else {
      // TODO: Implement LineObstacle collision
      return false;
    }
  }
}
