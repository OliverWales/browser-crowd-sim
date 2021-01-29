export class FloorMesh {
  static getVertices(width: number, height: number) {
    const w = width / 2;
    const h = height / 2;

    // prettier-ignore
    return [
      // position + normal
       w, -h, 0.0, 0.0, 0.0, 1.0,
       w,  h, 0.0, 0.0, 0.0, 1.0,
      -w, -h, 0.0, 0.0, 0.0, 1.0,
      -w,  h, 0.0, 0.0, 0.0, 1.0,
    ];
  }

  // prettier-ignore
  static indices = [
    1, 2, 0,
    1, 3, 2,
  ]
}
