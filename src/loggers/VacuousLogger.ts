import { IAgentCollection } from "../IAgentCollection";
import { ILogger } from "../ILogger";

// Empty logger implementation to allow measurement of the probe effect
export class VacuousLogger implements ILogger {
  private _logging: boolean = false;

  start(): void {
    this._logging = true;
  }

  stop(): void {
    if (!this._logging) {
      return;
    }

    this._logging = false;
  }

  log(agents: IAgentCollection, deltaT: number): void {}
}
