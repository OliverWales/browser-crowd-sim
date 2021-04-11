export interface Quartiles {
  minimum: number;
  lowerQuart: number;
  median: number;
  upperQuart: number;
  maximum: number;
}

export class Stats {
  static round3dp(f: number): number {
    return Math.round((f + Number.EPSILON) * 1000) / 1000; // epsilon to avoid FP errors
  }

  static sum(arr: number[]): number {
    return arr.reduce((a, b) => a + b, 0);
  }

  static quartiles(arr: number[]): Quartiles {
    const sorted = arr.slice().sort((a, b) => a - b);
    const n = sorted.length;

    const mid = Math.ceil(n / 2) - 1;
    const median =
      n % 2 == 0 ? (sorted[mid] + sorted[mid + 1]) / 2 : sorted[mid];

    return {
      minimum: sorted[0],
      lowerQuart: sorted[Math.ceil(n * 0.25) - 1],
      median: median,
      upperQuart: sorted[Math.ceil(n * 0.75) - 1],
      maximum: sorted[n - 1],
    };
  }
}
