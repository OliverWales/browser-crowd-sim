import { IRenderer } from "../interfaces/IRenderer";
import { Simulation } from "../Simulation";
import { Agent } from "../Agent";
import { CircleObstacle } from "../obstacles/CircleObstacle";
import { LineObstacle } from "../obstacles/LineObstacle";

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
    this.canvas.addEventListener("wheel", this.mouseScroll, { passive: false });
  }

  init(_simulation: Simulation) {}

  render(simulation: Simulation) {
    const scaleFactor = 800 / this.cameraDist;
    const agents = simulation.getAgents();
    const obstacles = simulation.getObstacles();

    // Clear background
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.fillStyle = "rgb(51, 51, 51)";
    this.context.fillRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );

    this.context.setTransform(
      scaleFactor,
      0,
      0,
      scaleFactor,
      this.xPan,
      this.yPan
    );

    // Draw obstacles
    this.context.strokeStyle = "white";
    this.context.lineWidth = 2;
    obstacles.forEach((obstacle) => {
      if (obstacle instanceof CircleObstacle) {
        this.drawCircleObstacle(obstacle);
      } else if (obstacle instanceof LineObstacle) {
        this.drawLineObstacle(obstacle);
      }
    });

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

    // y position inverted to match 3D view
    this.context.arc(position.x, -position.y, agent.Radius, 0, 2 * Math.PI);

    let magnitude = direction.magnitude();
    if (magnitude !== 0) {
      this.context.moveTo(position.x, -position.y);
      let newPos = position.add(
        direction.divide(magnitude).multiply(agent.Radius)
      );
      this.context.lineTo(newPos.x, -newPos.y);
    }

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
    if (this.cameraDist < 0.1) {
      this.cameraDist = 0.1;
    }

    event.preventDefault();
  };
}
