import { IAgentCollection } from "./IAgentCollection";
import { IRenderer } from "./IRenderer";

const vertexShaderText = [
  "precision mediump float;",
  "attribute vec2 position;",
  "void main()",
  "{",
  "  gl_Position = vec4(position, 0.0, 1.0);",
  "  gl_PointSize = 40.0;",
  "}",
].join("\n");

const fragmentShaderText = [
  "precision mediump float;",
  "void main()",
  "{",
  "  gl_FragColor = vec4(1, 0, 0, 1);",
  "}",
].join("\n");

export class Renderer3D implements IRenderer {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  positionAttribute: number;
  VBO: WebGLBuffer;

  constructor(canvas: HTMLCanvasElement) {
    this.gl = canvas.getContext("webgl");

    if (!this.gl) {
      console.error("WebGL not supported");
      return;
    }

    const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

    this.gl.shaderSource(vertexShader, vertexShaderText);
    this.gl.shaderSource(fragmentShader, fragmentShaderText);

    this.gl.compileShader(vertexShader);
    if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
      console.error(
        "ERROR compiling vertex shader",
        this.gl.getShaderInfoLog(vertexShader)
      );
      return;
    }

    this.gl.compileShader(fragmentShader);
    if (!this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)) {
      console.error(
        "ERROR compiling fragment shader",
        this.gl.getShaderInfoLog(fragmentShader)
      );
      return;
    }

    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error(
        "ERROR linking program",
        this.gl.getProgramInfoLog(this.program)
      );
      return;
    }

    this.gl.validateProgram(this.program);
    if (!this.gl.getProgramParameter(this.program, this.gl.VALIDATE_STATUS)) {
      console.error(
        "ERROR validating program",
        this.gl.getProgramInfoLog(this.program)
      );
      return;
    }

    this.positionAttribute = this.gl.getAttribLocation(
      this.program,
      "position"
    );

    this.VBO = this.gl.createBuffer();
  }

  clear(): void {
    this.gl.clearColor(1, 1, 1, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  drawAgents(agents: IAgentCollection): void {
    let positions: number[] = [];
    let width = this.gl.canvas.width;
    let height = this.gl.canvas.height;

    let agentCount = 0;
    agents.forEach((agent) => {
      const pos = agent.getPosition();
      positions.push((2 * pos.x) / width - 1);
      positions.push((2 * pos.y) / height - 1);
      agentCount++;
    });

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.VBO);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.STATIC_DRAW
    );

    this.gl.vertexAttribPointer(
      this.positionAttribute,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(this.positionAttribute);

    this.gl.useProgram(this.program);

    this.gl.drawArrays(this.gl.POINTS, 0, agentCount);
  }
}
