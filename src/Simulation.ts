import { IAgentCollection } from "./IAgentCollection";
import { IObstacle } from "./IObstacle";
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
        this._agents.getNeighboursInRangeEuclidean(agent, range),
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
}
