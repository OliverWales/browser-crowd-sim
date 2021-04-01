import { Agent } from "./Agent";
import { AgentFactory } from "./AgentFactory";
import { IObstacle } from "./IObstacle";
import { CircleObstacle } from "./obstacles/CircleObstacle";
import { LineObstacle } from "./obstacles/LineObstacle";
import { Vector2f } from "./Vector2f";

export interface Configuration {
  agents: Agent[];
  obstacles: IObstacle[];
}

export class ConfigurationFactory {
  static getConfiguration(
    type: string,
    agentType: string,
    width: number,
    height: number,
    numberOfAgents: number
  ): Configuration {
    switch (type) {
      case "RandomToRandom":
        return this.RandomToRandom(agentType, width, height, numberOfAgents);
      case "RandomToLine":
        return this.RandomToLine(agentType, width, height, numberOfAgents);
      case "CircleToCircle":
        return this.CircleToCircle(agentType, width, height, numberOfAgents);
      case "GridToGrid":
        return this.GridToGrid(agentType, width, height, numberOfAgents);
      case "Bollards":
        return this.Bollards(agentType, width, height, numberOfAgents);
      case "Bottleneck":
        return this.Bottleneck(agentType, width, height, numberOfAgents);
      case "BottleneckWithNav":
        return this.BottleneckWithNav(agentType, width, height, numberOfAgents);
      case "Slalom":
        return this.Slalom(agentType, width, height, numberOfAgents);
      case "SlalomWithNav":
        return this.SlalomWithNav(agentType, width, height, numberOfAgents);
      default:
        throw new Error(`Unknown configuration type \"${type}\"`);
    }
  }

  private static RandomToRandom(
    agentType: string,
    width: number,
    height: number,
    numberOfAgents: number
  ): Configuration {
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
    numberOfAgents = Math.min(startPositions.length, goalPositions.length);

    for (let i = 0; i < numberOfAgents; i++) {
      const agent = AgentFactory.getAgent(
        agentType,
        i,
        startPositions[i],
        this.preferredVelocityFromGoalPosition(goalPositions[i])
      );
      agents.push(agent);
    }

    return { agents: agents, obstacles: [] };
  }

  private static RandomToLine(
    agentType: string,
    width: number,
    height: number,
    numberOfAgents: number
  ): Configuration {
    // Random start position to fixed position on line
    let agents: Agent[] = [];
    let startPositions = this.poissonDiskSample(
      width,
      height,
      numberOfAgents,
      50
    ).map((x) => x.subtract(new Vector2f(width / 2, height / 2)));
    numberOfAgents = startPositions.length;

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

    return { agents: agents, obstacles: [] };
  }

  private static CircleToCircle(
    agentType: string,
    _width: number,
    height: number,
    numberOfAgents: number
  ): Configuration {
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

    return { agents: agents, obstacles: [] };
  }

  private static GridToGrid(
    agentType: string,
    width: number,
    _height: number,
    numberOfAgents: number
  ): Configuration {
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

    return { agents: agents, obstacles: [] };
  }

  private static Bollards(
    agentType: string,
    width: number,
    height: number,
    numberOfAgents: number
  ): Configuration {
    const agents: Agent[] = [];
    const startPositions = this.poissonDiskSample(
      width / 2 - 200,
      height - 40,
      numberOfAgents,
      80
    ).map((x) => x.subtract(new Vector2f(width / 2, height / 2 - 20)));
    numberOfAgents = startPositions.length;

    for (let i = 0; i < numberOfAgents; i++) {
      const agent = AgentFactory.getAgent(
        agentType,
        i,
        startPositions[i],
        this.preferredVelocityFromGoalPosition(
          startPositions[i].add(new Vector2f(width / 2 + 200, 0))
        )
      );
      agents.push(agent);
    }

    const obstacles: IObstacle[] = [];

    // Central line of bollards
    for (let i = 0; i < 5; i++) {
      obstacles.push(new CircleObstacle(new Vector2f(0, 120 * i - 240), 20));
    }

    return { agents: agents, obstacles: obstacles };
  }

  private static Bottleneck(
    agentType: string,
    width: number,
    height: number,
    numberOfAgents: number
  ): Configuration {
    const gapWidth = 200;
    const agents: Agent[] = [];
    const startPositions = this.poissonDiskSample(
      width / 2 - 200,
      height - 40,
      numberOfAgents,
      80
    ).map((x) => x.subtract(new Vector2f(width / 2, height / 2 - 20)));
    numberOfAgents = startPositions.length;

    for (let i = 0; i < numberOfAgents; i++) {
      const agent = AgentFactory.getAgent(
        agentType,
        i,
        startPositions[i],
        this.preferredVelocityFromGoalPosition(
          startPositions[i].add(new Vector2f(width / 2 + 200, 0))
        )
      );
      agents.push(agent);
    }

    const obstacles: IObstacle[] = [];

    // Central wall with narrow opening
    obstacles.push(
      new LineObstacle(new Vector2f(0, -500), new Vector2f(0, -gapWidth / 2))
    );
    obstacles.push(
      new LineObstacle(new Vector2f(0, 500), new Vector2f(0, gapWidth / 2))
    );

    return { agents: agents, obstacles: obstacles };
  }

  private static BottleneckWithNav(
    agentType: string,
    width: number,
    height: number,
    numberOfAgents: number
  ): Configuration {
    const gapWidth = 200;
    const agents: Agent[] = [];
    const startPositions = this.poissonDiskSample(
      width / 2 - 200,
      height - 40,
      numberOfAgents,
      80
    ).map((x) => x.subtract(new Vector2f(width / 2, height / 2 - 20)));
    numberOfAgents = startPositions.length;

    for (let i = 0; i < numberOfAgents; i++) {
      const prefVel = (pos: Vector2f) => {
        if (pos.x < 0) {
          if (pos.magnitudeSqrd() > ((gapWidth - 20) / 2) ** 2) {
            return this.preferredVelocityFromGoalPosition(new Vector2f(0, 0))(
              pos
            );
          } else {
            return new Vector2f(1, 0);
          }
        } else {
          return this.preferredVelocityFromGoalPosition(
            startPositions[i].add(new Vector2f(width / 2 + 200, 0))
          )(pos);
        }
      };
      const agent = AgentFactory.getAgent(
        agentType,
        i,
        startPositions[i],
        prefVel
      );
      agents.push(agent);
    }

    const obstacles: IObstacle[] = [];

    // Central wall with narrow opening
    obstacles.push(
      new LineObstacle(new Vector2f(0, -500), new Vector2f(0, -gapWidth / 2))
    );
    obstacles.push(
      new LineObstacle(new Vector2f(0, 500), new Vector2f(0, gapWidth / 2))
    );

    return { agents: agents, obstacles: obstacles };
  }

  private static Slalom(
    agentType: string,
    width: number,
    height: number,
    numberOfAgents: number
  ): Configuration {
    const agents: Agent[] = [];
    const startPositions = this.poissonDiskSample(
      width / 2 - 250,
      height - 40,
      numberOfAgents,
      80
    ).map((x) => x.subtract(new Vector2f(width / 2, height / 2 - 20)));
    numberOfAgents = startPositions.length;

    const gapHeight = 200;
    const wallHeight = height / 2 - gapHeight;

    for (let i = 0; i < numberOfAgents; i++) {
      const agent = AgentFactory.getAgent(
        agentType,
        i,
        startPositions[i],
        this.preferredVelocityFromGoalPosition(
          startPositions[i].add(new Vector2f(width / 2 + 250, 0))
        )
      );
      agents.push(agent);
    }

    const obstacles: IObstacle[] = [];

    // Slalom
    obstacles.push(
      new LineObstacle(new Vector2f(-200, 500), new Vector2f(-200, -wallHeight))
    );
    obstacles.push(
      new LineObstacle(new Vector2f(0, -500), new Vector2f(0, wallHeight))
    );
    obstacles.push(
      new LineObstacle(new Vector2f(200, 500), new Vector2f(200, -wallHeight))
    );

    return { agents: agents, obstacles: obstacles };
  }

  private static SlalomWithNav(
    agentType: string,
    width: number,
    height: number,
    numberOfAgents: number
  ): Configuration {
    const agents: Agent[] = [];
    const startPositions = this.poissonDiskSample(
      width / 2 - 250,
      height - 40,
      numberOfAgents,
      80
    ).map((x) => x.subtract(new Vector2f(width / 2, height / 2 - 20)));
    numberOfAgents = startPositions.length;

    const gapHeight = 200;
    const wallHeight = height / 2 - gapHeight;
    const midGap = wallHeight + gapHeight / 2;

    for (let i = 0; i < numberOfAgents; i++) {
      const prefVel = (pos: Vector2f) => {
        if (pos.x <= -200) {
          if (
            pos.subtract(new Vector2f(-200, -midGap)).magnitudeSqrd() <
            (gapHeight - 20) ** 2 // Subtract agent radius
          ) {
            return new Vector2f(1, 0);
          } else {
            return this.preferredVelocityFromGoalPosition(
              new Vector2f(-200, -midGap)
            )(pos);
          }
        } else if (pos.x <= 0) {
          if (
            pos.subtract(new Vector2f(0, midGap)).magnitudeSqrd() <
            (gapHeight - 20) ** 2 // Subtract agent radius
          ) {
            return new Vector2f(1, 0);
          } else {
            return this.preferredVelocityFromGoalPosition(
              new Vector2f(0, midGap)
            )(pos);
          }
        } else if (pos.x <= 200) {
          if (
            pos.subtract(new Vector2f(200, -midGap)).magnitudeSqrd() <
            (gapHeight - 20) ** 2 // Subtract agent radius
          ) {
            return new Vector2f(1, 0);
          } else {
            return this.preferredVelocityFromGoalPosition(
              new Vector2f(200, -midGap)
            )(pos);
          }
        } else {
          return this.preferredVelocityFromGoalPosition(
            new Vector2f(
              startPositions[i].x + width / 2 + 250,
              -startPositions[i].y
            )
          )(pos);
        }
      };
      const agent = AgentFactory.getAgent(
        agentType,
        i,
        startPositions[i],
        prefVel
      );
      agents.push(agent);
    }

    const obstacles: IObstacle[] = [];

    // Slalom
    obstacles.push(
      new LineObstacle(new Vector2f(-200, 500), new Vector2f(-200, -wallHeight))
    );
    obstacles.push(
      new LineObstacle(new Vector2f(0, -500), new Vector2f(0, wallHeight))
    );
    obstacles.push(
      new LineObstacle(new Vector2f(200, 500), new Vector2f(200, -wallHeight))
    );

    return { agents: agents, obstacles: obstacles };
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

      let attempts = 0;
      while (resample) {
        attempts++;
        resample = false;
        pos = new Vector2f(xRange * Math.random(), yRange * Math.random());

        samples.forEach((sample) => {
          if (pos.subtract(sample).magnitudeSqrd() < threshold ** 2) {
            resample = true;
          }
        });

        // Prevent crash if there is insufficient space to add a new agent
        if (attempts > 1000) {
          console.warn(
            `Failed to find poisson disk sample (placed ${i}/${n}).`
          );
          return samples;
        }
      }

      samples.push(pos);
    }

    return samples;
  }
}
