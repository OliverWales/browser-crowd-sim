import { ILogger } from "../ILogger";

// Empty logger implementation to allow measurement of the probe effect
export class VacuousLogger implements ILogger {
  private _logging: boolean = false;

  start() {
    console.log("Started logging");
  }

  log(): void {}

  stop(): void {
    if (!this._logging) {
      return;
    }

    console.log("Stopped logging");
    this._logging = false;
  }
}
