import { IAgentCollection } from "../IAgentCollection";
import { ILogger } from "../ILogger";

// Simple logger implementation for basic analysis
export class SimpleLogger implements ILogger {
  private _logging: boolean = false;
  private _timeStep: number = 0;
  private _collisions: number[] = [];
  private _frameTimes: number[] = [];

  start(): void {
    this._logging = true;
    this._timeStep = 0;
    this._frameTimes = [];
    this._collisions = [];
    console.log("Started logging");
  }

  stop(): void {
    if (!this._logging) {
      return;
    }

    this._logging = false;
    console.log("Stopped logging");
    console.log(`Timesteps: ${this._timeStep}`);
    console.log(
      `Total frame time: ${this._frameTimes.reduce((a, b) => a + b, 0)}`
    );
    console.log(`Frame times: ${this._frameTimes}`);
    console.log(
      `Total collisions: ${this._collisions.reduce((a, b) => a + b, 0)}`
    );
    console.log(`Collisions: ${this._collisions}`);
  }

  log(agents: IAgentCollection, deltaT: number): void {
    if (!this._logging) {
      return;
    }

    this._frameTimes[this._timeStep] = deltaT;
    this._collisions[this._timeStep] = 0;

    agents.forEach((agent) => {
      const neighbours = agents.getNeighboursInRangeRectilinear(agent, 100);
      neighbours.forEach((neighbour) => {
        if (
          neighbour.Id < agent.Id /* avoids double counting */ &&
          neighbour
            .getPosition()
            .subtract(agent.getPosition())
            .magnitudeSqrd() <
            (neighbour.Radius + agent.Radius) ** 2
        ) {
          this._collisions[this._timeStep]++;
        }
      });
    });

    this._timeStep++;
  }
}
