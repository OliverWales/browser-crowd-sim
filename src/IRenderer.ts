import { Simulation } from "./Simulation";

export interface IRenderer {
  render(simulation: Simulation): void;
}
