import { IAgent } from "./IAgent";

export interface IAgentCollection {
  init(agents: IAgent[]): void;

  getAll(): IAgent[];

  getNeighboursInRangeRectilinear(agent: IAgent, range: number): IAgent[];

  getNeighboursInRangeEuclidean(agent: IAgent, range: number): IAgent[];

  forEach(fun: (agent: IAgent) => void): void;
}
