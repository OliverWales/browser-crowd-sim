import { IAgent } from "./IAgent";
import { IAgentCollection } from "./IAgentCollection";
import { IRenderer } from "./IRenderer";

export class Renderer2D implements IRenderer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  // Camera controls
  private drag: boolean;
  private oldX: number;
  private oldY: number;
  private xPan = 0;
  private yPan = 0;
  private cameraDist = 800; // Start camera 800 'px' away

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");

    // Add event listeners
    this.canvas.addEventListener("mousedown", this.mouseDown, false);
    this.canvas.addEventListener("mouseup", this.mouseUp, false);
    this.canvas.addEventListener("mouseout", this.mouseUp, false);
    this.canvas.addEventListener("mousemove", this.mouseMove, false);
    this.canvas.addEventListener("wheel", this.mouseScroll, false);
  }

  clear(): void {
    this.context.fillStyle = "rgb(51, 51, 51)";
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
    this.context.resetTransform();
    this.context.scale(scaleFactor, scaleFactor);
    this.context.translate(this.xPan, this.yPan);

    agents.forEach((agent) => {
      this.drawAgent(agent);
    });
  }

  private drawAgent(agent: IAgent): void {
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
    console.log("Down");
  };

  private mouseUp = (event: MouseEvent) => {
    this.drag = false;
    event.preventDefault();
    console.log("Up");
  };

  private mouseMove = (event: MouseEvent) => {
    if (!this.drag) {
      return false;
    }
    this.xPan += event.pageX - this.oldX;
    this.yPan += event.pageY - this.oldY;

    console.log(
      `Move - oldX: ${this.oldX} oldY: ${this.oldY} pageX: ${event.pageX} pageY: ${event.pageY}`
    );

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
