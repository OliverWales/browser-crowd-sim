import { Vector2f } from "../src/Vector2f";

describe("Vector2f Operations Tests", function () {
  it("Add", function () {
    let a = new Vector2f(3, 4);
    let b = new Vector2f(1, 2);

    expect(a.add(b)).toEqual(new Vector2f(4, 6));
  });

  it("Subtract", function () {
    let a = new Vector2f(3, 4);
    let b = new Vector2f(1, 2);

    expect(a.subtract(b)).toEqual(new Vector2f(2, 2));
  });

  it("MagnitudeSqrd", function () {
    let a = new Vector2f(3, 4);

    expect(a.magnitudeSqrd()).toEqual(25);
  });

  it("Magnitude", function () {
    let a = new Vector2f(3, 4);

    expect(a.magnitude()).toEqual(5);
  });
});
