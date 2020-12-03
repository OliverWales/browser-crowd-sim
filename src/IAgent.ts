import { Vector2f } from "./Vector2f";

export interface IAgent {
  readonly Radius: number;
  readonly Id: number;

  getPosition(): Vector2f;
  getDirection(): Vector2f;
  getIsDone(): boolean;
  getIsStuck(): boolean;

  update(deltaT: number, agents: IAgent[]): void;
}
