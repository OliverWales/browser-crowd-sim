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

  static transpose(m: Float32Array) {
    const result = new Float32Array(16);

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result[i * 4 + j] = m[j * 4 + i];
      }
    }

    return result;
  }

  static invert(a: Float32Array) {
    const a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
    const a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
    const a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
    const a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    const det =
      b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      return null;
    }

    const result = new Float32Array(16);

    const iDet = 1.0 / det;
    result[0] = (a11 * b11 - a12 * b10 + a13 * b09) * iDet;
    result[1] = (a02 * b10 - a01 * b11 - a03 * b09) * iDet;
    result[2] = (a31 * b05 - a32 * b04 + a33 * b03) * iDet;
    result[3] = (a22 * b04 - a21 * b05 - a23 * b03) * iDet;
    result[4] = (a12 * b08 - a10 * b11 - a13 * b07) * iDet;
    result[5] = (a00 * b11 - a02 * b08 + a03 * b07) * iDet;
    result[6] = (a32 * b02 - a30 * b05 - a33 * b01) * iDet;
    result[7] = (a20 * b05 - a22 * b02 + a23 * b01) * iDet;
    result[8] = (a10 * b10 - a11 * b08 + a13 * b06) * iDet;
    result[9] = (a01 * b08 - a00 * b10 - a03 * b06) * iDet;
    result[10] = (a30 * b04 - a31 * b02 + a33 * b00) * iDet;
    result[11] = (a21 * b02 - a20 * b04 - a23 * b00) * iDet;
    result[12] = (a11 * b07 - a10 * b09 - a12 * b06) * iDet;
    result[13] = (a00 * b09 - a01 * b07 + a02 * b06) * iDet;
    result[14] = (a31 * b01 - a30 * b03 - a32 * b00) * iDet;
    result[15] = (a20 * b03 - a21 * b01 + a22 * b00) * iDet;
    return result;
  }
}
