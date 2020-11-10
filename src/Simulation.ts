import { IConfiguration } from "./Configurations";
import { IAgent } from "./IAgent";
import { IRenderer } from "./IRenderer";

export class Simulation {
  _renderer: IRenderer;
  _agents: IAgent[];

  constructor(renderer: IRenderer) {
    this._renderer = renderer;
    this._agents = [];
  }

  init(config: IConfiguration) {
    this._agents = config.agents;
  }

  update(deltaT: number) {
    this._agents.forEach((agent) => {
      agent.update(deltaT);
    });
  }

  draw() {
    this._renderer.clear();
    this._agents.forEach((agent) => {
      this._renderer.drawAgent(agent);
    });
  }
}
