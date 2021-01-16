import { IAgentCollection } from "./IAgentCollection";
import { IRenderer } from "./IRenderer";
import { Agent } from "./Agent";

export class Simulation {
  _renderer: IRenderer;
  _agents: IAgentCollection;

  constructor(renderer: IRenderer, agents: IAgentCollection) {
    this._renderer = renderer;
    this._agents = agents;
  }

  init(agents: Agent[]) {
    this._agents.init(agents);
  }

  update(deltaT: number) {
    let range = 300;
    this._agents.forEach((agent) => {
      agent.update(
        deltaT,
        this._agents.getNeighboursInRangeEuclidean(agent, range)
      );
    });

    this._agents.init(this._agents.getAll());
  }

  draw() {
    this._renderer.clear();
    this._renderer.drawAgents(this._agents);
  }
}
