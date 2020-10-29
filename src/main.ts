import { Renderer2D } from "./Renderer2D";
import { BasicAgent } from "./BasicAgent";

export function init() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const renderer = new Renderer2D(canvas);
  const agent = new BasicAgent({ x: canvas.width / 2, y: canvas.height / 2 });
  let lastRender = 0;

  function loop(timestamp: number) {
    let deltaT = timestamp - lastRender;
    lastRender = timestamp;

    // update
    agent.update(deltaT);

    // render
    renderer.clear();
    renderer.drawAgent(agent);

    window.requestAnimationFrame(loop);
  }

  window.requestAnimationFrame(loop);
}
