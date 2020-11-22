import { IAgentCollection } from "./IAgentCollection";
import { IRenderer } from "./IRenderer";
import { IConfiguration } from "./Configurations";

export class Simulation {
  _renderer: IRenderer;
  _agents: IAgentCollection;

  constructor(renderer: IRenderer, agents: IAgentCollection) {
    this._renderer = renderer;
    this._agents = agents;
  }

  init(config: IConfiguration) {
    this._agents.addAgents(config.agents);
  }

  update(deltaT: number) {
    this._agents.forEach((agent) => {
      agent.update(deltaT, this._agents.getAll());
    });
  }

  draw() {
    this._renderer.clear();
    this._agents.forEach((agent) => {
      this._renderer.drawAgent(agent);
    });
  }
}
