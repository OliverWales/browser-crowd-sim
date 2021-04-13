import { Agent } from "./Agent";
import { Vector2f } from "./maths/Vector2f";
import { BasicAgent } from "./agents/BasicAgent";
import { StopAgent } from "./agents/StopAgent";
import { VOAgent } from "./agents/VOAgent";
import { RVOAgent } from "./agents/RVOAgent";
import { HRVOAgent } from "./agents/HRVOAgent";

export class AgentFactory {
  static getAgent(
    type: string,
    id: number,
    startPosition: Vector2f,
    goalPosition: Vector2f,
    getPreferredVelocity: (position: Vector2f) => Vector2f
  ): Agent {
    switch (type) {
      case "BasicAgent":
        return new BasicAgent(
          id,
          startPosition,
          goalPosition,
          getPreferredVelocity
        );
      case "StopAgent":
        return new StopAgent(
          id,
          startPosition,
          goalPosition,
          getPreferredVelocity
        );
      case "VOAgent":
        return new VOAgent(
          id,
          startPosition,
          goalPosition,
          getPreferredVelocity
        );
      case "RVOAgent":
        return new RVOAgent(
          id,
          startPosition,
          goalPosition,
          getPreferredVelocity
        );
      case "HRVOAgent":
        return new HRVOAgent(
          id,
          startPosition,
          goalPosition,
          getPreferredVelocity
        );
      default:
        throw new Error(`Unknown agent type \"${type}\"`);
    }
  }
}
