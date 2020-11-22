import { IAgent } from "./IAgent";

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
      startPosition: { x: number; y: number },
      goalPosition: { x: number; y: number },
      radius: number
    ) => IAgent
  ) {
    // Random start position to random goal position
    let agents: IAgent[] = [];
    for (let i = 0; i < n; i++) {
      const agent = agentConstructor(
        i,
        { x: width * Math.random(), y: height * Math.random() },
        { x: width * Math.random(), y: height * Math.random() },
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
      startPosition: { x: number; y: number },
      goalPosition: { x: number; y: number },
      radius: number
    ) => IAgent
  ) {
    // Random start position to fixed position on line
    let agents: IAgent[] = [];
    for (let i = 0; i < n; i++) {
      const agent = agentConstructor(
        i,
        { x: width * Math.random(), y: height * Math.random() },
        { x: ((i + 1) / (n + 1)) * width, y: height / 2 },
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
      startPosition: { x: number; y: number },
      goalPosition: { x: number; y: number },
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
        {
          x: centreX + radius * Math.cos(angle),
          y: centreY + radius * Math.sin(angle),
        },
        {
          x: centreX + radius * Math.cos(angle + Math.PI),
          y: centreY + radius * Math.sin(angle + Math.PI),
        },
        20
      );
      agents.push(agent);
    }

    return { agents: agents } as IConfiguration;
  }
}
