import { Simulation } from "./Simulation";
import { IRenderer } from "./IRenderer";
import { Renderer2D } from "./renderers/Renderer2D";
import { Renderer3D } from "./renderers/Renderer3D";
import { AgentTree } from "./AgentTree";
import { ConfigurationFactory } from "./ConfigurationFactory";
import { TraceRenderer } from "./renderers/TraceRenderer";
import { SimpleLogger } from "./loggers/SimpleLogger";

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
const logger = new SimpleLogger();
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
      logger.log(simulation.getAgents(), simulation.getObstacles(), deltaT);
    }

    if (simulation.isDone()) {
      stop();
      logger.stop();
    }

    // Render
    renderer.render(simulation);
    frames++;

    // Recalculate framerate every 250ms
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
      break;
    case "3D":
      document.getElementById("view2d").classList.remove("selected");
      document.getElementById("view3d").classList.add("selected");
      document.getElementById("viewTrace").classList.remove("selected");
      renderer = renderer3d;
      canvas2d.style.display = "none";
      canvas3d.style.display = "block";
      canvasTrace.style.display = "none";
      break;
    case "Trace":
      document.getElementById("view2d").classList.remove("selected");
      document.getElementById("view3d").classList.remove("selected");
      document.getElementById("viewTrace").classList.add("selected");
      renderer = rendererTrace;
      canvas2d.style.display = "none";
      canvas3d.style.display = "none";
      canvasTrace.style.display = "block";
      break;
    default:
      throw new Error(`Unknown view \"${view}\"`);
  }
  renderer.init(simulation);
}

// Toggle play/pause
export function playPause() {
  play = !play;

  if (play) {
    logger.start();
    logger.log(simulation.getAgents(), simulation.getObstacles(), 0); // log initial conditions
    playButton.textContent = "Pause";
    stepButton.disabled = true;
  } else {
    logger.stop();
    playButton.textContent = "Play";
    stepButton.disabled = false;
  }
}

// Step simulation by 1 frame
export function step() {
  const deltaT = 1000 / 60; // assumes 60FPS
  simulation.update(deltaT, range);

  if (simulation.isDone()) {
    stop();
  }
}

export function reconfigure() {
  play = false;
  playButton.textContent = "Play";
  playButton.disabled = false;
  stepButton.disabled = false;

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

  renderer.init(simulation);
}

function stop() {
  play = false;
  playButton.disabled = true;
  stepButton.disabled = true;
}
