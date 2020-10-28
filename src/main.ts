import { Renderer2D } from "./Renderer2D";
import { BasicAgent } from "./BasicAgent";

export function init() {
  let canvas = document.getElementById("canvas") as HTMLCanvasElement;
  let renderer = new Renderer2D(canvas);
  renderer.clear();

  let agent = new BasicAgent({ x: canvas.width / 2, y: canvas.height / 2 });
  renderer.drawAgent(agent);
}
