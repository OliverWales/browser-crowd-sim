import { Agent } from "../Agent";
import { Vector2f } from "../maths/Vector2f";
import { Colour } from "../Colour";
import { IObstacle } from "../interfaces/IObstacle";
import { CircleObstacle } from "../obstacles/CircleObstacle";
import { Geometry } from "../maths/Geometry";
import { LineObstacle } from "../obstacles/LineObstacle";

export class StopAgent extends Agent {
  private _isStuck: boolean;

  constructor(
    id: number,
    startPosition: Vector2f,
    goalPosition: Vector2f,
    getPreferredVelocity: (position: Vector2f) => Vector2f
  ) {
    super(id, startPosition, goalPosition, getPreferredVelocity);
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

  update(stepSize: number, neighbours: Agent[], obstacles: IObstacle[]): void {
    if (this._isDone) {
      return;
    }

    const preferredVelocity = this._getPreferredVelocity(this._position);

    // Check if done
    if (preferredVelocity.magnitudeSqrd() < 0.1) {
      this._isDone = true;
      return;
    }

    const heading = this._position.add(
      preferredVelocity.normalise().multiply(25)
    );

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
    } else if (obstacle instanceof LineObstacle) {
      const t = Geometry.getFirstRayCircleIntersection(
        position,
        this.Radius,
        obstacle.Start,
        obstacle.End.subtract(obstacle.Start)
      );

      return t > 0 && t < 1;
    }
  }
}
