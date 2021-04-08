import { Agent } from "../Agent";

export interface IAgentCollection {
  update(agents: Agent[]): void;

  getAll(): Agent[];

  getNeighboursInRangeRectilinear(agent: Agent, range: number): Agent[];

  getNeighboursInRangeEuclidean(agent: Agent, range: number): Agent[];

  forEach(fun: (agent: Agent) => void): void;
}
