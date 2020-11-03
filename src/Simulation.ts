import { IAgent } from "./IAgent";
import { IRenderer } from "./IRenderer";

export class Simulation {
  _renderer: IRenderer;
  _agents: IAgent[];

  constructor(renderer: IRenderer) {
    this._renderer = renderer;
    this._agents = [];
  }

  addAgent(agent: IAgent) {
    this._agents.push(agent);
  }

  update(deltaT: number) {
    this._agents.forEach((agent) => {
      agent.update(deltaT);
    });
  }

  draw() {
    this._renderer.clear();
    this._agents.forEach((agent) => {
      this._renderer.drawAgent(agent);
    });
  }
}
