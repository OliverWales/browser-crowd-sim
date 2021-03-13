import { VOAgent } from "../src/agents/VOAgent";
import { LineObstacle } from "../src/obstacles/LineObstacle";
import { Vector2f } from "../src/Vector2f";

describe("Line Obstacle Avoidance Tests", function () {
  it("Collinear", function () {
    const lineObstacle = new LineObstacle(
      new Vector2f(0, 40),
      new Vector2f(0, 80)
    );

    const agent = new VOAgent(0, new Vector2f(0, 0), (x) => new Vector2f(0, 1));
    const vo = lineObstacle.getVelocityObstacle(agent);

    expect(vo).not.toBeNull();
    expect(vo.vertex).toEqual(new Vector2f(0, 0));

    expect(Math.abs(Math.atan2(vo.tangent1.x, vo.tangent1.y))).toBeCloseTo(
      Math.PI / 6
    );
    expect(Math.abs(Math.atan2(vo.tangent1.x, vo.tangent1.y))).toBeCloseTo(
      Math.PI / 6
    );
  });

  it("Isosceles", function () {
    const lineObstacle = new LineObstacle(
      new Vector2f(-40, 40),
      new Vector2f(40, 40)
    );

    const agent = new VOAgent(0, new Vector2f(0, 0), (x) => new Vector2f(0, 1));
    const vo = lineObstacle.getVelocityObstacle(agent);

    expect(vo).not.toBeNull();
    expect(vo.vertex).toEqual(new Vector2f(0, 0));

    expect(Math.abs(Math.atan2(vo.tangent1.x, vo.tangent1.y))).toBeCloseTo(
      Math.PI / 4 + Math.acos(Math.SQRT2 / 4)
    );
    expect(Math.abs(Math.atan2(vo.tangent2.x, vo.tangent2.y))).toBeCloseTo(
      Math.PI / 4 + Math.acos(Math.SQRT2 / 4)
    );
  });

  it("Scalene", function () {
    const lineObstacle = new LineObstacle(
      new Vector2f(40, 40),
      new Vector2f(80, 40)
    );

    const agent = new VOAgent(0, new Vector2f(0, 0), (x) => new Vector2f(0, 1));
    const vo = lineObstacle.getVelocityObstacle(agent);

    expect(vo).not.toBeNull();
    expect(vo.vertex).toEqual(new Vector2f(0, 0));

    // TODO: Check tangents
  });
});
