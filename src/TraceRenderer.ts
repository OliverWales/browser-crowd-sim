import { IRenderer } from "./IRenderer";
import { Simulation } from "./Simulation";
import { Agent } from "./Agent";

export class TraceRenderer implements IRenderer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
    this.clear();
  }

  clear() {
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
  }

  render(simulation: Simulation) {
    const agents = simulation.getAgents();

    // Draw agents
    agents.forEach((agent) => {
      this.drawAgent(agent);
    });
  }

  private drawAgent(agent: Agent): void {
    const position = agent.getPosition();
    const colour = agent.getColour();

    this.context.beginPath();
    this.context.fillStyle = `rgb(${colour.r}, ${colour.g}, ${colour.b})`;
    this.context.fillRect(position.x, -position.y, 1, 1);
  }
}
