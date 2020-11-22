import { IAgent } from "./IAgent";

export interface IAgentCollection {
  addAgent(agent: IAgent): void;

  getAll(): IAgent[];

  getNeighboursInRangeRectilinear(agent: IAgent, range: number): IAgent[];

  getNeighboursInRangeEuclidean(agent: IAgent, range: number): IAgent[];
}
