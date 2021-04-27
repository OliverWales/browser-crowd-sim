import { IRenderer } from "../interfaces/IRenderer";
import { Simulation } from "../Simulation";
import { Agent } from "../Agent";
import { LineObstacle } from "../obstacles/LineObstacle";
import { CircleObstacle } from "../obstacles/CircleObstacle";

export class TraceRenderer implements IRenderer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private _done: boolean;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
  }

  init(simulation: Simulation) {
    this._done = false;

    // Clear background
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.fillStyle = "rgb(135, 194, 250)";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.setTransform(
      1,
      0,
      0,
      1,
      this.canvas.width / 2,
      this.canvas.height / 2
    );

    // Draw floor
    this.context.fillStyle = "rgb(51, 51, 51)";
    this.context.fillRect(
      -this.canvas.width * 0.55,
      -this.canvas.height * 0.55,
      this.canvas.width * 1.1,
      this.canvas.height * 1.1
    );

    // Draw obstacles
    this.context.strokeStyle = "white";
    this.context.lineWidth = 2;
    simulation.getObstacles().forEach((obstacle) => {
      if (obstacle instanceof CircleObstacle) {
        this.drawCircleObstacle(obstacle);
      } else if (obstacle instanceof LineObstacle) {
        this.drawLineObstacle(obstacle);
      }
    });
  }

  render(simulation: Simulation) {
    const agents = simulation.getAgents();

    // Draw agents
    agents.forEach((agent) => {
      this.drawAgent(agent);
    });

    if (simulation.isDone() && !this._done) {
      this._done = true;
      agents.forEach((agent) => {
        this.drawAgentFinal(agent);
      });
    }
  }

  private drawAgent(agent: Agent): void {
    const position = agent.getPosition();
    const colour = agent.getColour();

    this.context.beginPath();
    this.context.fillStyle = `rgb(${colour.r}, ${colour.g}, ${colour.b})`;
    this.context.fillRect(position.x, -position.y, 1, 1);
    this.context.stroke();
  }

  private drawAgentFinal(agent: Agent): void {
    const position = agent.getPosition();
    const colour = agent.getColour();

    this.context.beginPath();
    this.context.fillStyle = `rgb(${colour.r}, ${colour.g}, ${colour.b})`;
    this.context.arc(position.x, -position.y, agent.Radius, 0, 2 * Math.PI);
    this.context.stroke();
  }

  private drawCircleObstacle(obstacle: CircleObstacle) {
    this.context.beginPath();

    this.context.arc(
      obstacle.Position.x,
      -obstacle.Position.y, // y position inverted to match 3D view
      obstacle.Radius,
      0,
      2 * Math.PI
    );

    const d = obstacle.Radius * Math.SQRT1_2;

    this.context.moveTo(obstacle.Position.x - d, obstacle.Position.y - d);
    this.context.lineTo(obstacle.Position.x + d, obstacle.Position.y + d);

    this.context.moveTo(obstacle.Position.x + d, obstacle.Position.y - d);
    this.context.lineTo(obstacle.Position.x - d, obstacle.Position.y + d);

    this.context.stroke();
  }

  private drawLineObstacle(obstacle: LineObstacle) {
    this.context.beginPath();

    this.context.moveTo(obstacle.Start.x, -obstacle.Start.y);
    this.context.lineTo(obstacle.End.x, -obstacle.End.y);

    this.context.stroke();
  }
}
