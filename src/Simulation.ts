import { IAgentCollection } from "./IAgentCollection";
import { Agent } from "./Agent";

export class Simulation {
  private _agents: IAgentCollection;
  private _range: number;

  constructor(agents: IAgentCollection) {
    this._agents = agents;
  }

  init(agents: Agent[], range: number) {
    this._agents.update(agents);
    this._range = range;
  }

  update(deltaT: number) {
    this._agents.forEach((agent) => {
      agent.update(
        deltaT,
        this._agents.getNeighboursInRangeEuclidean(agent, this._range)
      );
    });

    this._agents.update(this._agents.getAll());
  }

  getAgents() {
    return this._agents;
  }
}
