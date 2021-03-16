import { Geometry } from "../src/Geometry";
import { Vector2f } from "../src/Vector2f";

describe("Geometry Helper Tests", function () {
  it("Line-line Intersection", function () {
    const a1 = new Vector2f(1, 1);
    const a2 = new Vector2f(4, 3);
    const b1 = new Vector2f(5, 0);
    const b2 = new Vector2f(0, 4);

    const intersection = Geometry.getLineLineIntersection(a1, a2, b1, b2);
    expect(intersection).toEqual(new Vector2f(2.5, 2));
  });
});
