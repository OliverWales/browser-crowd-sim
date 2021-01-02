import { IAgentCollection } from "./IAgentCollection";

export interface IRenderer {
  clear(): void;
  drawAgents(agents: IAgentCollection): void;
}
