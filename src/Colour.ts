export class Colour {
  r: number;
  g: number;
  b: number;

  static White: Colour = {
    r: 255,
    g: 255,
    b: 255,
  };

  static Red: Colour = {
    r: 255,
    g: 0,
    b: 0,
  };

  static Green: Colour = {
    r: 0,
    g: 255,
    b: 0,
  };

  static FromHsv(h: number, s: number, v: number): Colour {
    // assuming hsv values in range 0-1
    h *= 6;

    const fract = h - Math.floor(h);
    const P = v * (1 - s);
    const Q = v * (1 - s * fract);
    const T = v * (1 - s * (1 - fract));

    if (0 <= h && h < 1) {
      return { r: v * 255, g: T * 255, b: P * 255 };
    } else if (1 <= h && h < 2) {
      return { r: Q * 255, g: v * 255, b: P * 255 };
    } else if (2 <= h && h < 3) {
      return { r: P * 255, g: v * 255, b: T * 255 };
    } else if (3 <= h && h < 4) {
      return { r: P * 255, g: Q * 255, b: v * 255 };
    } else if (4 <= h && h < 5) {
      return { r: T * 255, g: P * 255, b: v * 255 };
    } else if (5 <= h && h < 6) {
      return { r: v * 255, g: P * 255, b: Q * 255 };
    } else {
      return { r: 0, g: 0, b: 0 };
    }
  }
}
