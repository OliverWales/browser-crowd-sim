import { IAgentCollection } from "./IAgentCollection";
import { IRenderer } from "./IRenderer";
import { AgentMesh } from "./AgentMesh";
import { Vector2f } from "./Vector2f";

const vertexShaderText = `
  precision mediump float;
  attribute vec3 vertPosition;
  uniform mat4 projMat;
  uniform mat4 modelMat;
  void main()
  {
    gl_Position = projMat * vec4(vertPosition, 1.0);
  }
`;

const fragmentShaderText = `
  precision mediump float;
  void main()
  {
    gl_FragColor = vec4(1, 0, 0, 1);
  }
`;

export class Renderer3D implements IRenderer {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  VertexBuffer: WebGLBuffer;
  IndexBuffer: WebGLBuffer;
  positionAttribute: number;
  projMatLoc: WebGLUniformLocation;
  modelMatLoc: WebGLUniformLocation;

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

    this.gl.useProgram(this.program);

    this.VertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.VertexBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(AgentMesh.vertices),
      this.gl.STATIC_DRAW
    );

    this.IndexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.IndexBuffer);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(AgentMesh.indices),
      this.gl.STATIC_DRAW
    );

    this.positionAttribute = this.gl.getAttribLocation(
      this.program,
      "vertPosition"
    );

    this.gl.vertexAttribPointer(
      this.positionAttribute,
      3,
      this.gl.FLOAT,
      false,
      3 * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    this.gl.enableVertexAttribArray(this.positionAttribute);

    this.projMatLoc = this.gl.getUniformLocation(this.program, "projMat");
    const projectionMatrix = this.getProjMatrix(
      1,
      this.gl.canvas.width / this.gl.canvas.height,
      0,
      100
    );
    this.gl.uniformMatrix4fv(this.projMatLoc, false, projectionMatrix);

    this.modelMatLoc = this.gl.getUniformLocation(this.program, "modelMat");
    this.gl.clearColor(1, 1, 1, 1);
  }

  clear(): void {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  drawAgents(agents: IAgentCollection): void {
    agents.forEach((agent) => {
      const modelMat = this.getModelMatrix(agent.getPosition(), -5);
      this.gl.uniformMatrix4fv(this.modelMatLoc, false, modelMat);
      this.gl.drawElements(
        this.gl.TRIANGLES,
        AgentMesh.indices.length,
        this.gl.UNSIGNED_SHORT,
        0
      );
    });
  }

  private getProjMatrix(
    fov: number,
    aspectRatio: number,
    near: number,
    far: number
  ): Float32Array {
    const f = 1.0 / Math.tan(fov / 2);
    const i = 1 / (near - far);

    // prettier-ignore
    return new Float32Array([
      f / aspectRatio, 0,                  0,  0,
                    0, f,                  0,  0,
                    0, 0,   (near + far) * i, -1,
                    0, 0, near * far * i * 2,  0
    ]);
  }

  private getModelMatrix(position: Vector2f, z: number): Float32Array {
    // prettier-ignore
    return new Float32Array([
               1,          0, 0, 0,
               0,          1, 0, 0,
               0,          0, 1, 0,
      position.x, position.y, z, 1
    ]);
  }
}
