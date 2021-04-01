import { IAgentCollection } from "./IAgentCollection";

export interface ILogger {
  start(): void;

  stop(): void;

  log(agents: IAgentCollection, deltaT: number): void;
}
