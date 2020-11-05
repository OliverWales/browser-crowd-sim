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
    let radius = 20;

    this._context.beginPath();
    this._context.arc(position.x, position.y, radius, 0, 2 * Math.PI);
    if (direction.dx !== 0 || direction.dy !== 0) {
      let magnitude = Math.sqrt(
        direction.dx * direction.dx + direction.dy * direction.dy
      );
      this._context.moveTo(position.x, position.y);
      this._context.lineTo(
        position.x + (radius * direction.dx) / magnitude,
        position.y + (radius * direction.dy) / magnitude
      );
    }
    this._context.stroke();
  }
}
