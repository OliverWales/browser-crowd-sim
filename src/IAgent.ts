import { Colour } from "./Colour";
import { Vector2f } from "./Vector2f";

export interface IAgent {
  readonly Radius: number;
  readonly Id: number;

  getPosition(): Vector2f;
  getDirection(): Vector2f;
  getColour(): Colour;

  update(deltaT: number, agents: IAgent[]): void;
  isDone(): boolean;
}
