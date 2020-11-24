import { IAgentCollection } from "./IAgentCollection";
import { IAgent } from "./IAgent";

interface Node {
  agent: IAgent;
  left: Node;
  right: Node;
}

export class AgentTree implements IAgentCollection {
  private _root: Node;

  init(agents: IAgent[]): void {
    this._root = this.construct(agents, true);
  }

  getAll(): IAgent[] {
    return this.get(this._root);
  }

  getNeighboursInRangeRectilinear(agent: IAgent, range: number): IAgent[] {
    let minX = agent.getPosition().x - range;
    let minY = agent.getPosition().y - range;
    let maxX = agent.getPosition().x + range;
    let maxY = agent.getPosition().y + range;

    let candidates = this.rectilinear(this._root, minX, minY, maxX, maxY, true);
    return candidates.filter((other) => other.Id !== agent.Id);
  }

  getNeighboursInRangeEuclidean(agent: IAgent, range: number): IAgent[] {
    let candidates = this.getNeighboursInRangeRectilinear(agent, range);
    return candidates.filter(
      (other) =>
        (agent.getPosition().x - other.getPosition().x) ** 2 +
          (agent.getPosition().y - other.getPosition().y) ** 2 <=
        range ** 2
    );
  }

  forEach(fun: (agent: IAgent) => void): void {
    this.apply(this._root, fun);
  }

  private construct(agents: IAgent[], xAxis: boolean): Node {
    if (agents.length === 0) {
      return null;
    }

    let mid = Math.floor(agents.length / 2);

    let sorted = xAxis
      ? agents.sort((a, b) => a.getPosition().x - b.getPosition().x)
      : agents.sort((a, b) => a.getPosition().y - b.getPosition().y);

    let left = this.construct(sorted.slice(0, mid), !xAxis);
    let right = this.construct(sorted.slice(mid + 1, agents.length), !xAxis);

    return { agent: agents[mid], left: left, right: right };
  }

  private insert(agent: IAgent, root: Node, xAxis: boolean): Node {
    if (root == null) {
      return { agent: agent, left: null, right: null };
    }

    if (xAxis) {
      if (agent.getPosition().x < root.agent.getPosition().x) {
        root.left = this.insert(agent, root.left, !xAxis);
      } else {
        root.right = this.insert(agent, root.right, !xAxis);
      }
    } else {
      if (agent.getPosition().y < root.agent.getPosition().y) {
        root.left = this.insert(agent, root.left, !xAxis);
      } else {
        root.right = this.insert(agent, root.right, !xAxis);
      }
    }

    return root;
  }

  private get(root: Node): IAgent[] {
    if (root == null) {
      return [];
    }

    return this.get(root.left).concat(this.get(root.right)).concat(root.agent);
  }

  private rectilinear(
    root: Node,
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
    xAxis: boolean
  ): IAgent[] {
    if (root == null) {
      return [];
    }

    let res: IAgent[] = [];
    if (xAxis) {
      // If x <= maxX need to check right subtree
      if (root.agent.getPosition().x <= maxX) {
        res = res.concat(
          this.rectilinear(root.right, minX, minY, maxX, maxY, !xAxis)
        );
      }

      // If x >= minX need to check left subtree
      if (root.agent.getPosition().x >= minX) {
        res = res.concat(
          this.rectilinear(root.left, minX, minY, maxX, maxY, !xAxis)
        );
      }
    } else {
      // If y <= maxY need to check right subtree
      if (root.agent.getPosition().y <= maxY) {
        res = res.concat(
          this.rectilinear(root.right, minX, minY, maxX, maxY, !xAxis)
        );
      }

      // If y >= minY need to check left subtree
      if (root.agent.getPosition().y >= minY) {
        res = res.concat(
          this.rectilinear(root.left, minX, minY, maxX, maxY, !xAxis)
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
      res = res.concat(root.agent);
    }

    return res;
  }

  private apply(root: Node, fun: (agent: IAgent) => void): void {
    if (root == null) {
      return;
    }

    fun(root.agent);
    this.apply(root.left, fun);
    this.apply(root.right, fun);
  }
}
