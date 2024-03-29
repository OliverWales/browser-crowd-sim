import { IAgentCollection } from "./interfaces/IAgentCollection";
import { IObstacle } from "./interfaces/IObstacle";
import { Configuration } from "./ConfigurationFactory";

export class Simulation {
  private _agents: IAgentCollection;
  private _obstacles: IObstacle[];
  private _done: boolean;

  constructor(agents: IAgentCollection) {
    this._agents = agents;
  }

  init(configuration: Configuration) {
    this._done = false;
    this._agents.update(configuration.agents);
    this._obstacles = configuration.obstacles;
  }

  update(stepSize: number, range: number) {
    this._agents.forEach((agent) => {
      agent.update(
        stepSize,
        this._agents.getNeighboursInRangeEuclidean(
          agent,
          Math.min(range, agent.getDistanceToGoal() + agent.Radius) // ignore agents further away than goal position
        ),
        this._obstacles
      );
    });

    // Required to re-construct agent tree
    this._agents.update(this._agents.getAll());
  }

  getAgents() {
    return this._agents;
  }

  getObstacles() {
    return this._obstacles;
  }

  isDone() {
    if (this._done) {
      return true;
    }

    let done = true;
    this._agents.forEach((agent) => {
      done &&= agent.isDone();
    });

    this._done = done;
    return this._done;
  }
}
