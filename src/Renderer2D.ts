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

    this._context.arc(position.x, position.y, agent.Radius, 0, 2 * Math.PI);

    // draw direction
    let magnitude = direction.magnitude();
    if (magnitude !== 0) {
      this._context.moveTo(position.x, position.y);
      let newPos = position.add(
        direction.divide(magnitude).multiply(agent.Radius)
      );
      this._context.lineTo(newPos.x, newPos.y);
    }

    this._context.stroke();
  }
}
