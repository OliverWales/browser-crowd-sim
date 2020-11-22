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
    this._root = null;
    agents.forEach((agent) => {
      this._root = this.insert(agent, this._root, true);
    });
  }

  getAll(): IAgent[] {
    return this.get(this._root);
  }

  getNeighboursInRangeRectilinear(agent: IAgent, range: number): IAgent[] {
    throw new Error("Method not implemented.");
  }
  getNeighboursInRangeEuclidean(agent: IAgent, range: number): IAgent[] {
    throw new Error("Method not implemented.");
  }

  forEach(fun: (agent: IAgent) => void): void {
    this.apply(this._root, fun);
  }

  insert(agent: IAgent, root: Node, xAxis: boolean): Node {
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

  get(root: Node): IAgent[] {
    if (root == null) {
      return [];
    }

    return this.get(root.left).concat(this.get(root.right)).concat(root.agent);
  }

  apply(root: Node, fun: (agent: IAgent) => void): void {
    if (root == null) {
      return;
    }

    fun(root.agent);
    this.apply(root.left, fun);
    this.apply(root.right, fun);
  }
}
