import { IAgentCollection } from "./IAgentCollection";
import { IObstacle } from "./IObstacle";

export interface ILogger {
  start(agents: IAgentCollection): void;

  log(
    agents: IAgentCollection,
    obstacles: IObstacle[],
    stepSize: number,
    deltaT: number
  ): void;

  stop(agents: IAgentCollection): void;
}
