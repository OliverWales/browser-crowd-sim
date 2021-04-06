import { IAgentCollection } from "./IAgentCollection";
import { IObstacle } from "./IObstacle";

export interface ILogger {
  start(): void;

  stop(): void;

  log(agents: IAgentCollection, obstacles: IObstacle[], deltaT: number): void;
}
