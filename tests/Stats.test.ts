import { Stats } from "../src/maths/Stats";

describe("Stats Tests", function () {
  it("Quartiles of Even-sized Array", function () {
    const arr = [3, 6, 7, 8, 8, 10, 13, 15, 16, 20];
    const quartiles = Stats.quartiles(arr);
    expect(quartiles.minimum).toEqual(3);
    expect(quartiles.lowerQuart).toEqual(7);
    expect(quartiles.median).toEqual(9);
    expect(quartiles.upperQuart).toEqual(15);
    expect(quartiles.maximum).toEqual(20);
  });

  it("Quartiles of Odd-sized Array", function () {
    const arr = [3, 6, 7, 8, 8, 9, 10, 13, 15, 16, 20];
    const quartiles = Stats.quartiles(arr);
    expect(quartiles.minimum).toEqual(3);
    expect(quartiles.lowerQuart).toEqual(7);
    expect(quartiles.median).toEqual(9);
    expect(quartiles.upperQuart).toEqual(15);
    expect(quartiles.maximum).toEqual(20);
  });
});
