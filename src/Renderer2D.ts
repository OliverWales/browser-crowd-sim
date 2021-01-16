import { Agent } from "./Agent";
import { IAgentCollection } from "./IAgentCollection";
import { IRenderer } from "./IRenderer";

export class Renderer2D implements IRenderer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  // Camera controls
  private drag: boolean;
  private oldX: number;
  private oldY: number;
  private xPan: number;
  private yPan: number;
  private cameraDist = 800; // Start camera 800 'px' away

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
    this.xPan = this.canvas.width / 2;
    this.yPan = this.canvas.height / 2;

    // Add event listeners
    this.canvas.addEventListener("mousedown", this.mouseDown, false);
    this.canvas.addEventListener("mouseup", this.mouseUp, false);
    this.canvas.addEventListener("mouseout", this.mouseUp, false);
    this.canvas.addEventListener("mousemove", this.mouseMove, false);
    this.canvas.addEventListener("wheel", this.mouseScroll, false);
  }

  clear(): void {
    // Clear background
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.fillStyle = "rgb(135, 194, 250)";
    this.context.fillRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );
  }

  drawAgents(agents: IAgentCollection) {
    const scaleFactor = 800 / this.cameraDist;

    // TODO: replace with single setTransform
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.translate(this.xPan, this.yPan);
    this.context.scale(scaleFactor, scaleFactor);

    // Draw floor
    this.context.fillStyle = "rgb(51, 51, 51)";
    this.context.fillRect(
      -this.context.canvas.width * 0.55,
      -this.context.canvas.height * 0.55,
      this.context.canvas.width * 1.1,
      this.context.canvas.height * 1.1
    );

    // Draw agents
    agents.forEach((agent) => {
      this.drawAgent(agent);
    });
  }

  private drawAgent(agent: Agent): void {
    const position = agent.getPosition();
    const direction = agent.getDirection();
    const colour = agent.getColour();

    this.context.beginPath();
    this.context.strokeStyle = `rgb(${colour.r}, ${colour.g}, ${colour.b})`;
    this.context.lineWidth = 2;

    this.context.arc(position.x, position.y, agent.Radius, 0, 2 * Math.PI);

    let magnitude = direction.magnitude();
    if (magnitude !== 0) {
      this.context.moveTo(position.x, position.y);
      let newPos = position.add(
        direction.divide(magnitude).multiply(agent.Radius)
      );
      this.context.lineTo(newPos.x, newPos.y);
    }

    this.context.stroke();
  }

  private mouseDown = (event: MouseEvent) => {
    this.drag = true;
    this.oldX = event.pageX;
    this.oldY = event.pageY;
  };

  private mouseUp = (event: MouseEvent) => {
    this.drag = false;
    event.preventDefault();
  };

  private mouseMove = (event: MouseEvent) => {
    if (!this.drag) return false;

    this.xPan += event.pageX - this.oldX;
    this.yPan += event.pageY - this.oldY;

    this.oldX = event.pageX;
    this.oldY = event.pageY;
  };

  private mouseScroll = (event: WheelEvent) => {
    this.cameraDist += event.deltaY;
    if (this.cameraDist < 0) {
      this.cameraDist = 0;
    }

    event.preventDefault();
    console.log("Scroll");
  };
}
