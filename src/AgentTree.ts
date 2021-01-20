import { IAgentCollection } from "./IAgentCollection";
import { Agent } from "./Agent";

interface Node {
  agent: Agent;
  left: Node;
  right: Node;
}

export class AgentTree implements IAgentCollection {
  private _agents: Agent[];
  private _root: Node;

  constructor(agents: Agent[]) {
    this._agents = agents;
    this._root = this.constructTree(this._agents, true);
  }

  update(agents: Agent[]): void {
    this._agents = agents;
    this._root = this.constructTree(this._agents, true);
  }

  getAll(): Agent[] {
    return this._agents;
  }

  getNeighboursInRangeRectilinear(agent: Agent, range: number): Agent[] {
    let minX = agent.getPosition().x - range;
    let minY = agent.getPosition().y - range;
    let maxX = agent.getPosition().x + range;
    let maxY = agent.getPosition().y + range;

    let candidates = this.rangeSearch(this._root, minX, minY, maxX, maxY, true);
    return candidates.filter((other) => other.Id !== agent.Id);
  }

  getNeighboursInRangeEuclidean(agent: Agent, range: number): Agent[] {
    let candidates = this.getNeighboursInRangeRectilinear(agent, range);
    return candidates.filter(
      (other) =>
        agent.getPosition().subtract(other.getPosition()).magnitudeSqrd() <=
        range ** 2
    );
  }

  forEach(fun: (agent: Agent) => void): void {
    this._agents.forEach(fun);
  }

  private constructTree(agents: Agent[], xAxis: boolean): Node {
    if (agents.length === 0) {
      return null;
    }

    let mid = Math.floor(agents.length / 2);

    let sorted = xAxis
      ? agents.sort((a, b) => a.getPosition().x - b.getPosition().x)
      : agents.sort((a, b) => a.getPosition().y - b.getPosition().y);

    let left = this.constructTree(sorted.slice(0, mid), !xAxis);
    let right = this.constructTree(
      sorted.slice(mid + 1, agents.length),
      !xAxis
    );

    return { agent: agents[mid], left: left, right: right };
  }

  private rangeSearch(
    root: Node,
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
    xAxis: boolean
  ): Agent[] {
    if (root == null) {
      return [];
    }

    let res: Agent[] = [];
    if (xAxis) {
      // If x <= maxX need to check right subtree
      if (root.agent.getPosition().x <= maxX) {
        res = res.concat(
          this.rangeSearch(root.right, minX, minY, maxX, maxY, !xAxis)
        );
      }

      // If x >= minX need to check left subtree
      if (root.agent.getPosition().x >= minX) {
        res = res.concat(
          this.rangeSearch(root.left, minX, minY, maxX, maxY, !xAxis)
        );
      }
    } else {
      // If y <= maxY need to check right subtree
      if (root.agent.getPosition().y <= maxY) {
        res = res.concat(
          this.rangeSearch(root.right, minX, minY, maxX, maxY, !xAxis)
        );
      }

      // If y >= minY need to check left subtree
      if (root.agent.getPosition().y >= minY) {
        res = res.concat(
          this.rangeSearch(root.left, minX, minY, maxX, maxY, !xAxis)
        );
      }
    }

    // If the agent is in range range add to the result
    if (
      root.agent.getPosition().x >= minX &&
      root.agent.getPosition().y >= minY &&
      root.agent.getPosition().x <= maxX &&
      root.agent.getPosition().y <= maxY
    ) {
      res.push(root.agent);
    }

    return res;
  }
}
