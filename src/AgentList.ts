import { IAgentCollection } from "./IAgentCollection";
import { Agent } from "./Agent";

export class AgentList implements IAgentCollection {
  private _agents: Agent[];

  init(agents: Agent[]) {
    this._agents = agents;
  }

  getAll(): Agent[] {
    return this._agents;
  }

  getNeighboursInRangeRectilinear(agent: Agent, range: number): Agent[] {
    return this._agents.filter(
      (other) =>
        other.Id !== agent.Id &&
        Math.abs(agent.getPosition().x - other.getPosition().x) <= range &&
        Math.abs(agent.getPosition().y - other.getPosition().y) <= range
    );
  }

  getNeighboursInRangeEuclidean(agent: Agent, range: number): Agent[] {
    return this._agents.filter(
      (other) =>
        other.Id !== agent.Id &&
        agent.getPosition().subtract(other.getPosition()).magnitudeSqrd() <=
          range ** 2
    );
  }

  forEach(fun: (agent: Agent) => void): void {
    this._agents.forEach(fun);
  }
}
