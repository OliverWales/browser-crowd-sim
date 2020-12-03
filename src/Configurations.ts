import { IAgent } from "./IAgent";
import { Vector2f } from "./Vector2f";

export interface IConfiguration {
  agents: IAgent[];
}

export class Configurations {
  static RandomToRandom(
    n: number,
    width: number,
    height: number,
    agentConstructor: (
      id: number,
      startPosition: Vector2f,
      goalPosition: Vector2f,
      radius: number
    ) => IAgent
  ) {
    // Random start position to random goal position
    let agents: IAgent[] = [];
    for (let i = 0; i < n; i++) {
      const agent = agentConstructor(
        i,
        new Vector2f(width * Math.random(), height * Math.random()),
        new Vector2f(width * Math.random(), height * Math.random()),
        20
      );
      agents.push(agent);
    }

    return { agents: agents } as IConfiguration;
  }

  static RandomToLine(
    n: number,
    width: number,
    height: number,
    agentConstructor: (
      id: number,
      startPosition: Vector2f,
      goalPosition: Vector2f,
      radius: number
    ) => IAgent
  ) {
    // Random start position to fixed position on line
    let agents: IAgent[] = [];
    for (let i = 0; i < n; i++) {
      const agent = agentConstructor(
        i,
        new Vector2f(width * Math.random(), height * Math.random()),
        new Vector2f(((i + 1) / (n + 1)) * width, height / 2),
        20
      );
      agents.push(agent);
    }

    return { agents: agents } as IConfiguration;
  }

  static CircleToCircle(
    n: number,
    width: number,
    height: number,
    agentConstructor: (
      id: number,
      startPosition: Vector2f,
      goalPosition: Vector2f,
      radius: number
    ) => IAgent
  ) {
    // Position on radius of circle to opposite point
    let agents: IAgent[] = [];
    const centreX = width / 2;
    const centreY = height / 2;
    const radius = height / 2 - 25;

    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI * i) / n;
      const agent = agentConstructor(
        i,
        new Vector2f(
          centreX + radius * Math.cos(angle),
          centreY + radius * Math.sin(angle)
        ),
        new Vector2f(
          centreX + radius * Math.cos(angle + Math.PI),
          centreY + radius * Math.sin(angle + Math.PI)
        ),
        20
      );
      agents.push(agent);
    }

    return { agents: agents } as IConfiguration;
  }
}
