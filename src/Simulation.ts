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
    this._agents.init(config.agents);
  }

  update(deltaT: number) {
    let range = 200;
    this._agents.forEach((agent) => {
      if (agent.Id == 0) {
        let neighbours = this._agents.getNeighboursInRangeRectilinear(
          agent,
          range
        );
        neighbours.forEach((a) => {
          a.makeStuck();
        });
        console.log(neighbours.length);
      }

      agent.update(
        deltaT,
        this._agents.getNeighboursInRangeRectilinear(agent, range)
      );
    });
    this._agents.init(this._agents.getAll());
  }

  draw() {
    this._renderer.clear();
    this._agents.forEach((agent) => {
      this._renderer.drawAgent(agent);
    });
  }
}
