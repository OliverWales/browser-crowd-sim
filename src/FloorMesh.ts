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

  // Offset allows us to append these vertices to the end of an existing buffer
  static getIndices(offset = 0) {
    // prettier-ignore
    return [
      1, 2, 0,
      1, 3, 2,
    ].map((x) => x + offset);
  }
}
