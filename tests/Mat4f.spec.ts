import { Mat4f } from "../src/Mat4f";

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

    const c = Mat4f.multiplyMatrices(a, b);

    // prettier-ignore
    const expected = new Float32Array([
      112,  66, 192, 151,
       38,  11,  56,  40,
       68,  36, 112,  87,
       87,  44, 152, 112
    ])

    expect(c).toEqual(expected);
  });

  it("Matrix transpose", function () {
    // prettier-ignore
    const a = new Float32Array([
      1, 9, 7, 8,
      4, 2, 5, 0,
      2, 5, 5, 4,
      2, 8, 8, 3
    ]);

    // prettier-ignore
    const expected = new Float32Array([
      1, 4, 2, 2,
      9, 2, 5, 8,
      7, 5, 5, 8,
      8, 0, 4, 3
    ])

    expect(Mat4f.transpose(a)).toEqual(expected);
  });

  it("Matrix inverse", function () {
    // prettier-ignore
    const a = new Float32Array([
      -11,  -29, -151, -321, 
      -1,   -3,  -15,  -32, 
      -3,  -11,  -54, -115, 
       4,   11,   57,  121
    ]);

    // prettier-ignore
    const expected = new Float32Array([
      3, -18,  4,  7,
      6, -29,  5, 13,
      5,  -8,  3, 14,
     -3,   7, -2, -8
    ])

    expect(Mat4f.invert(a)).toEqual(expected);
  });
});
