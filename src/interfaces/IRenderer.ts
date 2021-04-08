import { Simulation } from "../Simulation";

export interface IRenderer {
  init(simulation: Simulation): void;
  render(simulation: Simulation): void;
}
