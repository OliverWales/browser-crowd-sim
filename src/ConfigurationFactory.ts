import { Agent } from "./Agent";
import { AgentFactory } from "./AgentFactory";
import { Vector2f } from "./Vector2f";

export class ConfigurationFactory {
  static getConfiguration(
    type: string,
    agentType: string,
    width: number,
    height: number,
    numberOfAgents: number
  ): Agent[] {
    switch (type) {
      case "RandomToRandom":
        return this.RandomToRandom(agentType, width, height, numberOfAgents);
      case "RandomToLine":
        return this.RandomToLine(agentType, width, height, numberOfAgents);
      case "CircleToCircle":
        return this.CircleToCircle(agentType, width, height, numberOfAgents);
      case "GridToGrid":
        return this.GridToGrid(agentType, width, height, numberOfAgents);
      default:
        throw new Error(`Unknown configuration type \"${type}\"`);
    }
  }

  private static RandomToRandom(
    agentType: string,
    width: number,
    height: number,
    numberOfAgents: number
  ): Agent[] {
    // Random start position to random goal position
    let agents: Agent[] = [];
    const startPositions = this.poissonDiskSample(
      width,
      height,
      numberOfAgents,
      50
    ).map((x) => x.subtract(new Vector2f(width / 2, height / 2)));

    const goalPositions = this.poissonDiskSample(
      width,
      height,
      numberOfAgents,
      50
    ).map((x) => x.subtract(new Vector2f(width / 2, height / 2)));

    for (let i = 0; i < numberOfAgents; i++) {
      const agent = AgentFactory.getAgent(
        agentType,
        i,
        startPositions[i],
        this.preferredVelocityFromGoalPosition(goalPositions[i])
      );
      agents.push(agent);
    }

    return agents;
  }

  static RandomToLine(
    agentType: string,
    width: number,
    height: number,
    numberOfAgents: number
  ) {
    // Random start position to fixed position on line
    let agents: Agent[] = [];
    let startPositions = this.poissonDiskSample(
      width,
      height,
      numberOfAgents,
      50
    ).map((x) => x.subtract(new Vector2f(width / 2, height / 2)));

    for (let i = 0; i < numberOfAgents; i++) {
      const agent = AgentFactory.getAgent(
        agentType,
        i,
        startPositions[i],
        this.preferredVelocityFromGoalPosition(
          new Vector2f(((i + 1) / (numberOfAgents + 1) - 1 / 2) * width, 0)
        )
      );
      agents.push(agent);
    }

    return agents;
  }

  static CircleToCircle(
    agentType: string,
    _width: number,
    height: number,
    numberOfAgents: number
  ) {
    // Position on radius of circle to opposite point
    let agents: Agent[] = [];
    const radius = height / 2 - 25;

    for (let i = 0; i < numberOfAgents; i++) {
      const angle = (2 * Math.PI * i) / numberOfAgents;
      const agent = AgentFactory.getAgent(
        agentType,
        i,
        new Vector2f(radius * Math.cos(angle), radius * Math.sin(angle)),
        this.preferredVelocityFromGoalPosition(
          new Vector2f(
            radius * Math.cos(angle + Math.PI),
            radius * Math.sin(angle + Math.PI)
          )
        )
      );
      agents.push(agent);
    }

    return agents;
  }

  static GridToGrid(
    agentType: string,
    width: number,
    _height: number,
    numberOfAgents: number
  ) {
    // Two opposing grids of agents passing through eachother
    let agents: Agent[] = [];
    const gridSize = Math.ceil(Math.sqrt(numberOfAgents / 2));
    const offset = 90;
    let x = 30 - width / 2;
    let y = ((gridSize - 1) / 2) * offset;

    for (let i = 0; i < numberOfAgents; i++) {
      const idx = Math.floor(i / 2);
      const row = Math.floor(idx / gridSize);
      const col = idx % gridSize;

      if (i % 2 == 0) {
        // LHS
        const agent = AgentFactory.getAgent(
          agentType,
          i,
          new Vector2f(x + (gridSize - 1 - col) * offset, y - row * offset),
          this.preferredVelocityFromGoalPosition(
            new Vector2f(-x - col * offset, y - row * offset)
          )
        );
        agents.push(agent);
      } else {
        // RHS
        const agent = AgentFactory.getAgent(
          agentType,
          i,
          new Vector2f(-x - (gridSize - 1 - col) * offset, y - row * offset),
          this.preferredVelocityFromGoalPosition(
            new Vector2f(x + col * offset, y - row * offset)
          )
        );
        agents.push(agent);
      }
    }

    return agents;
  }

  private static preferredVelocityFromGoalPosition(
    goalPosition: Vector2f
  ): (pos: Vector2f) => Vector2f {
    return (pos) => {
      const goalDirection = goalPosition.subtract(pos);
      if (goalDirection.magnitudeSqrd() < 1) {
        return goalDirection;
      } else {
        return goalDirection.normalise();
      }
    };
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
