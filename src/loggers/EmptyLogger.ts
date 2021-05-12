import { IAgentCollection } from "../interfaces/IAgentCollection";
import { ILogger } from "../interfaces/ILogger";
import { IObstacle } from "../interfaces/IObstacle";

// Empty logger implementation to allow measurement of the probe effect
export class EmptyLogger implements ILogger {
  private _logging: boolean = false;
  private _totalTime: number = 0;
  private _frames: number = 0;

  start(_agents: IAgentCollection) {
    console.log("------- Started logging -------");
    this._logging = true;
    this._totalTime = 0;
    this._frames = 0;
  }

  log(
    agents: IAgentCollection,
    _obstacles: IObstacle[],
    _stepSize: number,
    deltaT: number
  ): void {
    if (!this._logging) {
      return;
    }

    this._totalTime += deltaT;
    this._frames++;

    if (this._totalTime > 60000) {
      console.log("Timed Out");
      this.stop(agents);
    }
  }

  stop(_agents: IAgentCollection): void {
    if (!this._logging) {
      return;
    }

    console.log("Stopped logging");
    console.log(`Total time (ms): ${this._totalTime.toFixed(3)}`);
    this._logging = false;
    console.log(`Frames: ${this._frames}`);
    this._logging = false;
    console.log(`ms / Frame: ${(this._totalTime / this._frames).toFixed(3)}`);
    this._logging = false;
  }
}
