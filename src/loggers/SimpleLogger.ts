import { Geometry } from "../maths/Geometry";
import { IAgentCollection } from "../interfaces/IAgentCollection";
import { ILogger } from "../interfaces/ILogger";
import { IObstacle } from "../interfaces/IObstacle";
import { CircleObstacle } from "../obstacles/CircleObstacle";
import { LineObstacle } from "../obstacles/LineObstacle";
import { Vector2f } from "../maths/Vector2f";

// Simple logger implementation for basic analysis
export class SimpleLogger implements ILogger {
  private _logging: boolean = false;
  private _timeStep: number;
  private _agentCollisions: number[];
  private _obstacleCollisions: number[];
  private _frameTimes: number[];
  private _pathLengths: number[];
  private _startPositions: Vector2f[];

  start(agents: IAgentCollection): void {
    this._logging = true;
    this._timeStep = 0;
    this._frameTimes = [];
    this._agentCollisions = [];
    this._obstacleCollisions = [];
    this._pathLengths = [];
    this._startPositions = [];

    agents.forEach((agent) => {
      this._pathLengths[agent.Id] = 0;
      this._startPositions[agent.Id] = agent.getPosition();
    });

    console.log("Started logging");
  }

  log(agents: IAgentCollection, obstacles: IObstacle[], deltaT: number): void {
    if (!this._logging) {
      return;
    }

    this._frameTimes[this._timeStep] = this.round3dp(deltaT);
    this._agentCollisions[this._timeStep] = 0;
    this._obstacleCollisions[this._timeStep] = 0;

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
          this._agentCollisions[this._timeStep]++;
        }
      });

      obstacles.forEach((obstacle) => {
        if (obstacle instanceof LineObstacle) {
          const t = Geometry.getFirstRayCircleIntersection(
            agent.getPosition(),
            agent.Radius,
            obstacle.Start,
            obstacle.End.subtract(obstacle.Start)
          );

          if (t > 0 && t < 1) {
            this._obstacleCollisions[this._timeStep]++;
          }
        } else if (obstacle instanceof CircleObstacle) {
          if (
            obstacle.Position.subtract(agent.getPosition()).magnitudeSqrd() <
            (obstacle.Radius + agent.Radius) ** 2
          ) {
            this._obstacleCollisions[this._timeStep]++;
          }
        }
      });

      if (!agent.isDone()) {
        this._pathLengths[agent.Id] += agent.getDirection().magnitude();
      }
    });

    this._timeStep++;
  }

  stop(agents: IAgentCollection): void {
    if (!this._logging) {
      return;
    }

    console.log("Stopped logging");
    this._logging = false;

    const totalFrameTime = this.sum(this._frameTimes) / 1000;
    const totalAgentCollisions = this.sum(this._agentCollisions);
    const totalObstacleCollisions = this.sum(this._obstacleCollisions);
    const overhead: number[] = [];

    agents.forEach((agent) => {
      overhead[agent.Id] =
        this._pathLengths[agent.Id] /
          this._startPositions[agent.Id]
            .subtract(agent.getPosition())
            .magnitude() -
        1;
    });
    const averageOverhead = this.sum(overhead) / agents.getAll().length;

    console.log(`Timesteps: ${this._timeStep}`);
    console.log(`Total time: ${totalFrameTime.toFixed(3)} seconds`);
    console.log(`Frame times: ${this._frameTimes}`);

    console.log(`Total agent collisions: ${totalAgentCollisions}`);
    if (totalAgentCollisions > 0) {
      console.log(
        `Agent collisions per frame: ${(
          totalAgentCollisions / this._timeStep
        ).toFixed(3)}`
      );
      console.log(`Agent collisions:\n${this._agentCollisions}`);
    }

    console.log(`Total obstacle collisions: ${totalObstacleCollisions}`);
    if (totalObstacleCollisions > 0) {
      console.log(
        `Obstacle collisions per frame: ${(
          totalObstacleCollisions / this._timeStep
        ).toFixed(3)}`
      );
      console.log(`Obstacle collisions:\n${this._obstacleCollisions}`);
    }

    console.log(`Average overhead: ${averageOverhead}`);
    console.log(`Overheads:\n${overhead}`);
  }

  round3dp(f: number): number {
    return Math.round((f + Number.EPSILON) * 1000) / 1000; // epsilon to avoid FP errors
  }

  sum(arr: number[]): number {
    return arr.reduce((a, b) => a + b, 0);
  }
}
