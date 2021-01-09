import { off } from "process";
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
    const startPositions = this.poissonDiskSample(width, height, n, 50);
    const goalPositions = this.poissonDiskSample(width, height, n, 50);
    const centre = new Vector2f(width / 2, height / 2);

    for (let i = 0; i < n; i++) {
      const agent = agentConstructor(
        i,
        startPositions[i].subtract(centre),
        goalPositions[i].subtract(centre),
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
    let startPositions = this.poissonDiskSample(width, height, n, 50);
    const centre = new Vector2f(width / 2, height / 2);

    for (let i = 0; i < n; i++) {
      const agent = agentConstructor(
        i,
        startPositions[i].subtract(centre),
        new Vector2f(((i + 1) / (n + 1) - 1 / 2) * width, 0),
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
    const radius = height / 2 - 25;

    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI * i) / n;
      const agent = agentConstructor(
        i,
        new Vector2f(radius * Math.cos(angle), radius * Math.sin(angle)),
        new Vector2f(
          radius * Math.cos(angle + Math.PI),
          radius * Math.sin(angle + Math.PI)
        ),
        20
      );
      agents.push(agent);
    }

    return { agents: agents } as IConfiguration;
  }

  static GridToGrid(
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
    // Two opposing grids of agents passing through eachother
    let agents: IAgent[] = [];
    const gridSize = Math.ceil(Math.sqrt(n / 2));
    const offset = 90;
    let x = 30 - width / 2;
    let y = -((gridSize - 1) / 2) * offset;

    for (let i = 0; i < n; i++) {
      const idx = Math.floor(i / 2);
      const row = Math.floor(idx / gridSize);
      const col = idx % gridSize;

      if (i % 2 == 0) {
        // LHS
        const agent = agentConstructor(
          i,
          new Vector2f(x + (gridSize - 1 - col) * offset, y + row * offset),
          new Vector2f(-x - col * offset, y + row * offset),
          20
        );
        agents.push(agent);
      } else {
        // RHS
        const agent = agentConstructor(
          i,
          new Vector2f(-x - (gridSize - 1 - col) * offset, y + row * offset),
          new Vector2f(x + col * offset, y + row * offset),
          20
        );
        agents.push(agent);
      }
    }

    return { agents: agents } as IConfiguration;
  }

  private static poissonDiskSample(
    xRange: number,
    yRange: number,
    n: number,
    threshold: number
  ): Vector2f[] {
    let samples: Vector2f[] = [];

    for (var i = 0; i < n; i++) {
      let resample = true;
      let pos: Vector2f;

      while (resample) {
        resample = false;
        pos = new Vector2f(xRange * Math.random(), yRange * Math.random());

        samples.forEach((sample) => {
          if (pos.subtract(sample).magnitudeSqrd() < threshold ** 2) {
            resample = true;
          }
        });
      }

      samples.push(pos);
    }

    return samples;
  }
}
