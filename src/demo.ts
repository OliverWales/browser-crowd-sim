import { Simulation } from "./Simulation";
import { IRenderer } from "./IRenderer";
import { Renderer2D } from "./Renderer2D";
import { Renderer3D } from "./Renderer3D";
import { AgentTree } from "./AgentTree";
import { ConfigurationFactory } from "./ConfigurationFactory";
import { TraceRenderer } from "./TraceRenderer";

const configSelect = document.getElementById("config") as HTMLSelectElement;
const agentTypeSelect = document.getElementById(
  "agentType"
) as HTMLSelectElement;
const rangeInput = document.getElementById("range") as HTMLSelectElement;
const numberOfAgentsInput = document.getElementById(
  "numberOfAgents"
) as HTMLInputElement;

const canvas2d = document.getElementById("canvas2d") as HTMLCanvasElement;
const canvas3d = document.getElementById("canvas3d") as HTMLCanvasElement;
const canvasTrace = document.getElementById("canvasTrace") as HTMLCanvasElement;
const framerate = document.getElementById("framerate") as HTMLParagraphElement;
const playButton = document.getElementById("playButton") as HTMLButtonElement;
const stepButton = document.getElementById("stepButton") as HTMLButtonElement;

const simulation = new Simulation(new AgentTree([]));
const renderer2d = new Renderer2D(canvas2d);
const renderer3d = new Renderer3D(canvas3d);
const rendererTrace = new TraceRenderer(canvasTrace);
var renderer: IRenderer = renderer2d;
var play = false;
var range = 200;

// Initialise simulation and begin update/render loop
export function init() {
  this.reconfigure();

  let lastRender = 0;
  let lastFPS = 0;
  let frames = 0;

  function loop(timestamp: number) {
    let deltaT = timestamp - lastRender;
    lastRender = timestamp;

    // Update
    if (play) {
      simulation.update(deltaT, range);
    }

    // Render
    renderer.render(simulation);
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

// Switch view
export function switchView(view: string) {
  switch (view) {
    case "2D":
      document.getElementById("view2d").classList.add("selected");
      document.getElementById("view3d").classList.remove("selected");
      document.getElementById("viewTrace").classList.remove("selected");
      renderer = renderer2d;
      canvas2d.style.display = "block";
      canvas3d.style.display = "none";
      canvasTrace.style.display = "none";
      return;
    case "3D":
      document.getElementById("view2d").classList.remove("selected");
      document.getElementById("view3d").classList.add("selected");
      document.getElementById("viewTrace").classList.remove("selected");
      renderer = renderer3d;
      canvas2d.style.display = "none";
      canvas3d.style.display = "block";
      canvasTrace.style.display = "none";
      return;
    case "Trace":
      document.getElementById("view2d").classList.remove("selected");
      document.getElementById("view3d").classList.remove("selected");
      document.getElementById("viewTrace").classList.add("selected");
      renderer = rendererTrace;
      canvas2d.style.display = "none";
      canvas3d.style.display = "none";
      canvasTrace.style.display = "block";
      return;
    default:
      throw new Error(`Unknown view \"${view}\"`);
  }
}

// Toggle play/pause
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
  simulation.update(1000 / 60, range); // Assumes 60FPS
}

export function reconfigure() {
  if (play) {
    this.playPause();
  }

  const config = configSelect.value;
  const agentType = agentTypeSelect.value;
  range = parseInt(rangeInput.value) ?? 0;
  const numberOfAgents = parseInt(numberOfAgentsInput.value) ?? 0;

  simulation.init(
    ConfigurationFactory.getConfiguration(
      config,
      agentType,
      canvas2d.width,
      canvas2d.height,
      numberOfAgents
    )
  );

  rendererTrace.clear(simulation.getObstacles());
}
