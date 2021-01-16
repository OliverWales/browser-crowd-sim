import { IAgentCollection } from "./IAgentCollection";
import { Agent } from "./Agent";

export class Simulation {
  private _agents: IAgentCollection;

  constructor(agents: IAgentCollection) {
    this._agents = agents;
  }

  init(agents: Agent[]) {
    this._agents.init(agents);
  }

  update(deltaT: number) {
    let range = 400;
    this._agents.forEach((agent) => {
      agent.update(
        deltaT,
        this._agents.getNeighboursInRangeEuclidean(agent, range)
      );
    });

    this._agents.init(this._agents.getAll());
  }

  getAgents() {
    return this._agents;
  }
}
