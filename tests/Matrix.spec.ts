import { Matrix } from "../src/Matrix";

describe("Vector2f Operations Tests", function () {
  it("Matrix multiplication", function () {
    // prettier-ignore
    const a = new Float32Array([
      1, 9, 7, 8,
      4, 2, 5, 0,
      2, 5, 5, 4,
      2, 8, 8, 3
    ]);

    // prettier-ignore
    const b = new Float32Array([
      4, 0, 0, 0,
      6, 3, 8, 5,
      2, 1, 8, 6,
      5, 4, 8, 8
    ]);

    const c = Matrix.multiplyMatrices(a, b);

    // prettier-ignore
    const expected = new Float32Array([
      112,  66, 192, 151,
       38,  11,  56,  40,
       68,  36, 112,  87,
       87,  44, 152, 112
    ])

    expect(c).toEqual(expected);
  });
});
