import { Simulation } from "./Simulation";
import { Renderer2D } from "./Renderer2D";
import { BasicAgent } from "./BasicAgent";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const framerate = document.getElementById("framerate") as HTMLCanvasElement;
const playButton = document.getElementById("playButton") as HTMLButtonElement;
const stepButton = document.getElementById("stepButton") as HTMLButtonElement;

const renderer = new Renderer2D(canvas);
const simulation = new Simulation(renderer);
var play = false;

// initialise simulation and begin update/render loop
export function init() {
  const agent = new BasicAgent({ x: canvas.width / 2, y: canvas.height / 2 });
  simulation.addAgent(agent);

  let lastRender = 0;
  let lastFPS = 0;
  let frames = 0;

  function loop(timestamp: number) {
    let deltaT = timestamp - lastRender;
    lastRender = timestamp;

    // update
    if (play) {
      simulation.update(deltaT);
    }

    // render
    simulation.draw();
    frames++;

    // every 250ms, recalculate framerate
    if (timestamp - lastFPS >= 250) {
      framerate.textContent = `FPS: ${(
        (1000 * frames) /
        (timestamp - lastFPS)
      ).toFixed(1)}`;
      frames = 0;
      lastFPS = timestamp;
    }

    window.requestAnimationFrame(loop);
  }

  window.requestAnimationFrame(loop);
}

// toggle play/pause, and disallow step while playing
export function playPause() {
  play = !play;

  if (play) {
    playButton.textContent = "Pause";
    stepButton.disabled = true;
  } else {
    playButton.textContent = "Play";
    stepButton.disabled = false;
  }
}

// step simulation 1 frame, assuming 60FPS
export function step() {
  simulation.update(1000 / 60);
}
