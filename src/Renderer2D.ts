import { IAgent } from "./IAgent";
import { IAgentCollection } from "./IAgentCollection";
import { IRenderer } from "./IRenderer";

export class Renderer2D implements IRenderer {
  _context: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this._context = canvas.getContext("2d");
  }

  clear(): void {
    this._context.fillStyle = "white";
    this._context.fillRect(
      0,
      0,
      this._context.canvas.width,
      this._context.canvas.height
    );
  }

  drawAgents(agents: IAgentCollection) {
    agents.forEach((agent) => {
      this.drawAgent(agent);
    });
  }

  private drawAgent(agent: IAgent): void {
    const position = agent.getPosition();
    const direction = agent.getDirection();
    const colour = agent.getColour();

    this._context.beginPath();
    this._context.strokeStyle = "#000000"; // Must set strokeStyle before fillStyle
    this._context.fillStyle = `rgb(${colour.r}, ${colour.g}, ${colour.b})`;

    this._context.arc(position.x, position.y, agent.Radius, 0, 2 * Math.PI);

    let magnitude = direction.magnitude();
    if (magnitude !== 0) {
      this._context.moveTo(position.x, position.y);
      let newPos = position.add(
        direction.divide(magnitude).multiply(agent.Radius)
      );
      this._context.lineTo(newPos.x, newPos.y);
    }
    this._context.closePath();
    this._context.fill();
    this._context.stroke();
  }
}
