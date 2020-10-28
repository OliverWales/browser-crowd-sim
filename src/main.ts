import { Renderer2D } from "./Renderer2D";

export function init() {
  let canvas = document.getElementById("canvas") as HTMLCanvasElement;
  let renderer = new Renderer2D(canvas);
  renderer.clear();
}
