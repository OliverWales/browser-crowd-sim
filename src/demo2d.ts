import { Simulation } from "./Simulation";
import { Renderer2D } from "./Renderer2D";
import { AgentTree } from "./AgentTree";
import { ConfigurationFactory } from "./ConfigurationFactory";

const configSelect = document.getElementById("config") as HTMLSelectElement;
const agentTypeSelect = document.getElementById(
  "agentType"
) as HTMLSelectElement;
const numberOfAgentsInput = document.getElementById(
  "numberOfAgents"
) as HTMLInputElement;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const framerate = document.getElementById("framerate") as HTMLParagraphElement;
const playButton = document.getElementById("playButton") as HTMLButtonElement;
const stepButton = document.getElementById("stepButton") as HTMLButtonElement;

const renderer = new Renderer2D(canvas);
const simulation = new Simulation(renderer, new AgentTree());
var play = false;

// initialise simulation and begin update/render loop
export function init() {
  this.reconfigure();

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

    // recalculate framerate every 250ms
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

// toggle play/pause
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

// step simulation by 1 frame
export function step() {
  simulation.update(1000 / 60); // Assumes 60FPS
}

export function reconfigure() {
  if (play) {
    this.playPause();
  }

  const config = configSelect.value;
  const agentType = agentTypeSelect.value;
  const numberOfAgents = parseInt(numberOfAgentsInput.value) ?? 0;

  simulation.init(
    ConfigurationFactory.getConfiguration(
      config,
      agentType,
      canvas.width,
      canvas.height,
      numberOfAgents
    )
  );
}
