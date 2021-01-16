import { AgentList } from "../src/AgentList";
import { Agent } from "../src/Agent";
import { BasicAgent } from "../src/agents/BasicAgent";
import { Vector2f } from "../src/Vector2f";

describe("AgentList Range Search Tests", function () {
  it("Rectilinear", function () {
    let tree = new AgentList();
    let agents: Agent[] = [];
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 5; j++) {
        agents.push(
          new BasicAgent(
            5 * i + j,
            new Vector2f(i, j),
            (x) => new Vector2f(0, 0)
          )
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

  it("Euclidean", function () {
    let tree = new AgentList();
    let agents: Agent[] = [];
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 5; j++) {
        agents.push(
          new BasicAgent(
            5 * i + j,
            new Vector2f(i, j),
            (x) => new Vector2f(0, 0)
          )
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
