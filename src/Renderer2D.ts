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

    this._context.beginPath();
    this._context.arc(position.x, position.y, 50, 0, 2 * Math.PI);
    this._context.stroke();
  }
}
