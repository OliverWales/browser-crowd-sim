import { IAgentCollection } from "./IAgentCollection";
import { IRenderer } from "./IRenderer";

const vertexShaderText = [
  "precision mediump float;",
  "attribute vec2 position;",
  "attribute float radius;",
  "uniform float width;",
  "uniform float height;",
  "void main()",
  "{",
  "  gl_Position = vec4(2.0 * position.x / width - 1.0,",
  "                     2.0 * position.y / height - 1.0,",
  "                     0.0, 1.0);",
  "  gl_PointSize = 2.0 * radius;",
  "}",
].join("\n");

const fragmentShaderText = [
  "precision mediump float;",
  "void main()",
  "{",
  "  float dist = distance( gl_PointCoord, vec2(0.5) );",
  "  if (dist > 0.5) discard;",
  "  gl_FragColor = vec4(1, 0, 0, 1);",
  "}",
].join("\n");

export class Renderer3D implements IRenderer {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  positionAttribute: number;
  radiusAttribute: number;
  widthUniform: WebGLUniformLocation;
  heightUniform: WebGLUniformLocation;
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
    this.radiusAttribute = this.gl.getAttribLocation(this.program, "radius");

    this.widthUniform = this.gl.getUniformLocation(this.program, "width");
    this.heightUniform = this.gl.getUniformLocation(this.program, "height");

    this.VBO = this.gl.createBuffer();
  }

  clear(): void {
    this.gl.clearColor(1, 1, 1, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  drawAgents(agents: IAgentCollection): void {
    let vertexData: number[] = [];

    agents.forEach((agent) => {
      const pos = agent.getPosition();
      vertexData.push(pos.x);
      vertexData.push(pos.y);
      vertexData.push(agent.Radius);
    });

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.VBO);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(vertexData),
      this.gl.STATIC_DRAW
    );

    this.gl.vertexAttribPointer(
      this.positionAttribute,
      2,
      this.gl.FLOAT,
      false,
      3 * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    this.gl.enableVertexAttribArray(this.positionAttribute);

    this.gl.vertexAttribPointer(
      this.radiusAttribute,
      1,
      this.gl.FLOAT,
      false,
      3 * Float32Array.BYTES_PER_ELEMENT,
      2 * Float32Array.BYTES_PER_ELEMENT
    );
    this.gl.enableVertexAttribArray(this.radiusAttribute);

    this.gl.useProgram(this.program);
    this.gl.uniform1f(this.widthUniform, this.gl.canvas.width);
    this.gl.uniform1f(this.heightUniform, this.gl.canvas.height);

    this.gl.drawArrays(this.gl.POINTS, 0, vertexData.length / 3);
  }
}
