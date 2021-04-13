import { IAgentCollection } from "./interfaces/IAgentCollection";
import { IObstacle } from "./interfaces/IObstacle";
import { Configuration } from "./ConfigurationFactory";

export class Simulation {
  private _agents: IAgentCollection;
  private _obstacles: IObstacle[];

  constructor(agents: IAgentCollection) {
    this._agents = agents;
  }

  init(configuration: Configuration) {
    this._agents.update(configuration.agents);
    this._obstacles = configuration.obstacles;
  }

  update(deltaT: number, range: number) {
    this._agents.forEach((agent) => {
      agent.update(
        deltaT,
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
    let done = true;
    this._agents.forEach((agent) => {
      done &&= agent.isDone();
    });
    return done;
  }
}
