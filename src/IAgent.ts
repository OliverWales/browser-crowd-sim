export interface IAgent {
  readonly Radius: number;
  getPosition(): { x: number; y: number };
  getDirection(): { dx: number; dy: number };
  update(deltaT: number): void;
}
