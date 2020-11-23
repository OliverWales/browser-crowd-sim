import { IAgent } from "./IAgent";
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

  drawAgent(agent: IAgent) {
    let position = agent.getPosition();
    let direction = agent.getDirection();

    this._context.beginPath();

    // draw agent
    if (agent.getIsDone()) {
      this._context.strokeStyle = "#00FF00";
    } else if (agent.getIsStuck()) {
      this._context.strokeStyle = "#FF0000";
    } else {
      this._context.strokeStyle = "#000000";
    }

    // debug
    if (agent.Id == 0) {
      this._context.strokeStyle = "#FF00FF";
    }

    this._context.arc(position.x, position.y, agent.Radius, 0, 2 * Math.PI);

    // draw direction
    if (direction.dx !== 0 || direction.dy !== 0) {
      let magnitude = Math.sqrt(direction.dx ** 2 + direction.dy ** 2);

      this._context.moveTo(position.x, position.y);
      this._context.lineTo(
        position.x + (agent.Radius * direction.dx) / magnitude,
        position.y + (agent.Radius * direction.dy) / magnitude
      );
    }

    this._context.stroke();
  }
}
