import { IAgent } from "./IAgent";

export class StopAgent implements IAgent {
  public readonly Id: number;
  public readonly Radius: number;

  private _position: { x: number; y: number };
  private _goalPosition: { x: number; y: number };
  private _direction: { dx: number; dy: number };
  private _goalReached: boolean;

  constructor(
    id: number,
    startPosition: { x: number; y: number },
    goalPosition: { x: number; y: number },
    radius: number
  ) {
    this.Id = id;
    this._position = startPosition;
    this._goalPosition = goalPosition;
    this.Radius = radius;

    this._direction = { dx: 0, dy: 0 };
    this._goalReached = false;
  }

  getPosition(): { x: number; y: number } {
    return this._position;
  }

  getDirection(): { dx: number; dy: number } {
    return this._direction;
  }

  getGoalReached(): boolean {
    return this._goalReached;
  }

  update(deltaT: number, agents: IAgent[]): void {
    if (this._goalReached) {
      return;
    }

    let goalDirection = {
      x: this._goalPosition.x - this._position.x,
      y: this._goalPosition.y - this._position.y,
    };
    let goalDistance = Math.sqrt(goalDirection.x ** 2 + goalDirection.y ** 2);

    if (goalDistance > (deltaT * 60) / 1000) {
      this._direction.dx = goalDirection.x / goalDistance;
      this._direction.dy = goalDirection.y / goalDistance;
      let headingX = this._position.x + 20 * this._direction.dx;
      let headingY = this._position.y + 20 * this._direction.dy;

      let collides = false;
      agents.forEach((agent) => {
        if (
          agent.Id != this.Id &&
          this.collides(agent, { x: headingX, y: headingY })
        ) {
          collides = true;
        }
      });

      if (!collides) {
        this._position.x += ((deltaT * 60) / 1000) * this._direction.dx;
        this._position.y += ((deltaT * 60) / 1000) * this._direction.dy;
      }
    } else {
      this._position.x = this._goalPosition.x;
      this._position.y = this._goalPosition.y;
      this._goalReached = true;
    }
  }

  collides(agent: IAgent, position: { x: number; y: number }): boolean {
    let a1x = position.x;
    let a1y = position.y;
    let a1r = this.Radius;
    let a2x = agent.getPosition().x;
    let a2y = agent.getPosition().y;
    let a2r = agent.Radius;

    return Math.sqrt((a1x - a2x) ** 2 + (a1y - a2y) ** 2) < a1r + a2r;
  }
}
