import { IAgent } from "./IAgent";

export interface IRenderer {
  clear(): void;
  drawAgent(agent: IAgent): void;
}
