import { IAgentCollection } from "./IAgentCollection";
import { IAgent } from "./IAgent";

export class AgentList implements IAgentCollection {
  private _agents: IAgent[];

  constructor() {
    this._agents = [];
  }

  addAgent(agent: IAgent) {
    this._agents.push(agent);
  }

  getAll(): IAgent[] {
    return this._agents;
  }

  getNeighboursInRangeRectilinear(agent: IAgent, range: number): IAgent[] {
    return this._agents.filter(
      (other) =>
        other.Id !== agent.Id &&
        Math.abs(agent.getPosition().x - other.getPosition().x) <= range &&
        Math.abs(agent.getPosition().y - other.getPosition().y) <= range
    );
  }

  getNeighboursInRangeEuclidean(agent: IAgent, range: number): IAgent[] {
    return this._agents.filter(
      (other) =>
        other.Id !== agent.Id &&
        (agent.getPosition().x - other.getPosition().x) ** 2 +
          (agent.getPosition().y - other.getPosition().y) ** 2 <=
          range ** 2
    );
  }
}
