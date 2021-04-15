import { IAgentCollection } from "../interfaces/IAgentCollection";
import { ILogger } from "../interfaces/ILogger";
import { IObstacle } from "../interfaces/IObstacle";

// Empty logger implementation to allow measurement of the probe effect
export class VacuousLogger implements ILogger {
  private _logging: boolean = false;
  private _totalTime: number = 0;

  start() {
    console.log("Started logging");
  }

  log(
    _agents: IAgentCollection,
    _obstacles: IObstacle[],
    _stepSize: number,
    deltaT: number
  ): void {
    this._totalTime += deltaT;
  }

  stop(): void {
    if (!this._logging) {
      return;
    }

    console.log("Stopped logging");
    console.log(`Total time: ${this._totalTime.toFixed(3)} seconds`);
    this._logging = false;
  }
}
