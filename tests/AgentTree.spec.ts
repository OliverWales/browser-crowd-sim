import { AgentTree } from "../src/AgentTree";
import { BasicAgent } from "../src/BasicAgent";
import { IAgent } from "../src/IAgent";
import { Vector2f } from "../src/Vector2f";

describe("AgentTree Range Search Tests", function () {
  it("Rectilinear Range Search", function () {
    let tree = new AgentTree();
    let agents: IAgent[] = [];
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 5; j++) {
        agents.push(
          new BasicAgent(5 * i + j, new Vector2f(i, j), new Vector2f(i, j), 2)
        );
      }
    }

    tree.init(agents);
    let neighbourIds = tree
      .getNeighboursInRangeRectilinear(agents[12], 1.2)
      .map((x) => x.Id);

    // should not be neighbours with itself
    expect(neighbourIds).not.toContain(12);

    // neighbours in range
    expect(neighbourIds).toContain(6);
    expect(neighbourIds).toContain(7);
    expect(neighbourIds).toContain(8);
    expect(neighbourIds).toContain(11);
    expect(neighbourIds).toContain(13);
    expect(neighbourIds).toContain(16);
    expect(neighbourIds).toContain(17);
    expect(neighbourIds).toContain(18);

    // neighbours not in range
    expect(neighbourIds).not.toContain(0);
    expect(neighbourIds).not.toContain(2);
    expect(neighbourIds).not.toContain(4);
    expect(neighbourIds).not.toContain(10);
    expect(neighbourIds).not.toContain(4);
    expect(neighbourIds).not.toContain(20);
    expect(neighbourIds).not.toContain(22);
    expect(neighbourIds).not.toContain(24);
  });

  it("Euclidean Range Search", function () {
    let tree = new AgentTree();
    let agents: IAgent[] = [];
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 5; j++) {
        agents.push(
          new BasicAgent(5 * i + j, new Vector2f(i, j), new Vector2f(i, j), 2)
        );
      }
    }

    tree.init(agents);
    let neighbourIds = tree
      .getNeighboursInRangeEuclidean(agents[12], 1.2)
      .map((x) => x.Id);

    // should not be neighbours with itself
    expect(neighbourIds).not.toContain(12);

    // neighbours in range
    expect(neighbourIds).toContain(7);
    expect(neighbourIds).toContain(11);
    expect(neighbourIds).toContain(13);
    expect(neighbourIds).toContain(17);

    // neighbours not in range
    expect(neighbourIds).not.toContain(6);
    expect(neighbourIds).not.toContain(8);
    expect(neighbourIds).not.toContain(16);
    expect(neighbourIds).not.toContain(18);
  });
});
