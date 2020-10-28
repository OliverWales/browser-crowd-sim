import { HelloWorld } from "../src/HelloWorld";

console.log = jest.fn();

describe("calculate", function () {
  it("add", function () {
    HelloWorld.HelloWorld();
    expect(console.log).toBeCalledWith("Hello, World!");
    expect(console.log).toBeCalledTimes(1);
  });
});
