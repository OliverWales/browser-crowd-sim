export interface IAgent {
  getPosition(): { x: number; y: number };
  update(deltaT: number): void;
}
