export class Mat4f {
  static getIdentityMatrix(): Float32Array {
    // prettier-ignore
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }

  static getXRotationMatrix(angle: number): Float32Array {
    const s = Math.sin(angle);
    const c = Math.cos(angle);

    // prettier-ignore
    return new Float32Array([
      1, 0, 0, 0,
      0, c, s, 0,
      0,-s, c, 0,
      0, 0, 0, 1
    ]);
  }

  static getYRotationMatrix(angle: number): Float32Array {
    const s = Math.sin(angle);
    const c = Math.cos(angle);

    // prettier-ignore
    return new Float32Array([
      c, 0,-s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1
    ]);
  }

  static getZRotationMatrix(angle: number): Float32Array {
    const s = Math.sin(angle);
    const c = Math.cos(angle);

    // prettier-ignore
    return new Float32Array([
      c, s, 0, 0,
     -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }

  static getTranslationMatrix(x: number, y: number, z: number): Float32Array {
    // prettier-ignore
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1
    ]);
  }

  static getPerspectiveProjectionMatrix(
    fov: number,
    aspectRatio: number,
    near: number,
    far: number
  ): Float32Array {
    const f = 1.0 / Math.tan(fov / 2);
    const i = 1.0 / (near - far);

    // prettier-ignore
    return new Float32Array([
      f / aspectRatio, 0,                  0,  0,
                    0, f,                  0,  0,
                    0, 0,   (near + far) * i, -1,
                    0, 0, near * far * i * 2,  0
    ]);
  }

  static multiplyMatrices(a: Float32Array, b: Float32Array): Float32Array {
    const result = new Float32Array(16);

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let num = 0;
        for (let k = 0; k < 4; k++) {
          num += a[i * 4 + k] * b[k * 4 + j];
        }
        result[i * 4 + j] = num;
      }
    }

    return result;
  }
}
