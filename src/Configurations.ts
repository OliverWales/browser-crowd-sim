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
    let startPositions = this.poissonDiskSample(width, height, n, 50);
    let goalPositions = this.poissonDiskSample(width, height, n, 50);

    for (let i = 0; i < n; i++) {
      const agent = agentConstructor(
        i,
        startPositions[i],
        goalPositions[i],
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

    for (let i = 0; i < n; i++) {
      const agent = agentConstructor(
        i,
        startPositions[i],
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
    let rows = 4;
    let cols = Math.ceil(n / (2 * rows));
    let spacing = 80;
    let left = 50;
    let right = width - left - spacing * (cols - 1);
    let top = height / 2 - (spacing / 2) * (rows - 1);

    let id = 0;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let a = new Vector2f(left + spacing * i, top + spacing * j);
        let b = new Vector2f(right + spacing * i, top + spacing * j);

        // Left grid
        agents.push(agentConstructor(id, a, b, 20));
        id++;
        if (id >= n) {
          break;
        }

        // Right grid
        agents.push(agentConstructor(id, b, a, 20));
        id++;

        if (id >= n) {
          break;
        }
      }
      if (id >= n) {
        break;
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
