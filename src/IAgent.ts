export interface IAgent {
  readonly Radius: number;
  readonly Id: number;

  getPosition(): { x: number; y: number };
  getDirection(): { dx: number; dy: number };
  getIsDone(): boolean;
  getIsStuck(): boolean;

  makeStuck(): void;

  update(deltaT: number, agents: IAgent[]): void;
}
