import { IAgentCollection } from "./IAgentCollection";
import { IRenderer } from "./IRenderer";
import { AgentMesh } from "./AgentMesh";
import { Matrix } from "./Matrix";
import { Vector2f } from "./Vector2f";

const vertexShaderText = `
  precision mediump float;
  attribute vec3 vertPosition;
  uniform mat4 projMat;
  uniform mat4 viewMat;
  uniform mat4 worldMat;
  uniform vec2 position;
  uniform vec2 direction;
  uniform float radius;
  void main()
  {
    mediump vec3 rotatedVert = vec3(vertPosition.x * direction.x - vertPosition.y * direction.y,
                                    vertPosition.x * direction.y + vertPosition.y * direction.x,
                                    vertPosition.z);
    gl_Position = projMat * viewMat * worldMat * vec4(rotatedVert.x * radius + position.x, rotatedVert.y * radius + position.y, rotatedVert.z * radius, 1.0);
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
  // Rendering
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private VertexBuffer: WebGLBuffer;
  private IndexBuffer: WebGLBuffer;
  private positionAttribute: number;
  private projMatLoc: WebGLUniformLocation;
  private viewMatLoc: WebGLUniformLocation;
  private worldMatLoc: WebGLUniformLocation;
  private posVecLoc: WebGLUniformLocation;
  private dirVecLoc: WebGLUniformLocation;
  private radiusLoc: WebGLUniformLocation;

  // Camera controls
  private drag: boolean;
  private oldX: number;
  private oldY: number;
  private dX: number;
  private dY: number;
  private xRot = 0;
  private yRot = 0;
  private cameraDist = 800; // Start camera 800 'px' away

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    // Get WebGL context
    this.gl = this.canvas.getContext("webgl");

    if (!this.gl) {
      console.error("WebGL not supported");
      return;
    }

    // Compile shaders
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

    // Create and validate program
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

    // Set WebGL settings
    this.gl.useProgram(this.program);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.frontFace(this.gl.CCW);
    this.gl.cullFace(this.gl.BACK);
    this.gl.clearColor(1, 1, 1, 1);

    // Add event listeners
    this.canvas.addEventListener("mousedown", this.mouseDown, false);
    this.canvas.addEventListener("mouseup", this.mouseUp, false);
    this.canvas.addEventListener("mouseout", this.mouseUp, false);
    this.canvas.addEventListener("mousemove", this.mouseMove, false);
    this.canvas.addEventListener("wheel", this.mouseScroll, false);

    // Initialise vertex and index buffer
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

    // Get attribute locations
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

    // Get uniform locations
    this.projMatLoc = this.gl.getUniformLocation(this.program, "projMat");
    this.viewMatLoc = this.gl.getUniformLocation(this.program, "viewMat");
    this.worldMatLoc = this.gl.getUniformLocation(this.program, "worldMat");
    this.posVecLoc = this.gl.getUniformLocation(this.program, "position");
    this.dirVecLoc = this.gl.getUniformLocation(this.program, "direction");
    this.radiusLoc = this.gl.getUniformLocation(this.program, "radius");

    // Set up matrices
    const projectionMatrix = Matrix.getPerspectiveProjectionMatrix(
      45 * (Math.PI / 180), // 45deg y-axis FOV
      this.canvas.width / this.canvas.height,
      0.1,
      this.cameraDist + 2000
    );

    const viewMatrix = Matrix.getTranslationMatrix(0, 0, -this.cameraDist); // Move camera back on z axis

    // prettier-ignore
    const worldMatrix = Matrix.getIdentityMatrix();

    this.gl.uniformMatrix4fv(this.projMatLoc, false, projectionMatrix);
    this.gl.uniformMatrix4fv(this.viewMatLoc, false, viewMatrix);
    this.gl.uniformMatrix4fv(this.worldMatLoc, false, worldMatrix);
  }

  clear(): void {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  drawAgents(agents: IAgentCollection): void {
    agents.forEach((agent) => {
      // Position
      let pos = agent.getPosition();
      this.gl.uniform2f(
        this.posVecLoc,
        pos.x - this.canvas.width / 2,
        pos.y - this.canvas.height / 2
      );

      // Direction
      let dir = agent.getDirection().normalise();
      if (dir.x == 0 && dir.y == 0) {
        dir = new Vector2f(1, 0);
      }
      this.gl.uniform2f(this.dirVecLoc, dir.x, dir.y);

      // Radius
      this.gl.uniform1f(this.radiusLoc, agent.Radius);

      // Draw mesh
      this.gl.drawElements(
        this.gl.TRIANGLES,
        AgentMesh.indices.length,
        this.gl.UNSIGNED_SHORT,
        0
      );
    });
  }

  private mouseDown = (event: MouseEvent) => {
    this.drag = true;
    this.oldX = event.pageX;
    this.oldY = event.pageY;
    event.preventDefault();
    return false;
  };

  private mouseUp = (event: MouseEvent) => {
    this.drag = false;
    event.preventDefault();
    return false;
  };

  private mouseMove = (event: MouseEvent) => {
    if (!this.drag) return false;
    this.dX = ((event.pageX - this.oldX) * 2 * Math.PI) / this.canvas.width;
    this.dY = ((event.pageY - this.oldY) * 2 * Math.PI) / this.canvas.height;
    this.xRot += this.dX;
    this.yRot += this.dY;
    this.oldX = event.pageX;
    this.oldY = event.pageY;

    // Clamp Y rotation
    if (this.yRot > 0) {
      this.yRot = 0;
    }

    if (this.yRot < -Math.PI) {
      this.yRot = -Math.PI;
    }

    let xRotMat = Matrix.getZRotationMatrix(this.xRot);
    let yRotMat = Matrix.getXRotationMatrix(this.yRot);
    let worldMatrix = Matrix.multiplyMatrices(xRotMat, yRotMat);
    this.gl.uniformMatrix4fv(this.worldMatLoc, false, worldMatrix);

    console.log(this.yRot);

    event.preventDefault();
    return false;
  };

  private mouseScroll = (event: WheelEvent) => {
    this.cameraDist += event.deltaY;
    if (this.cameraDist < 0) {
      this.cameraDist = 0;
    }

    const viewMatrix = Matrix.getTranslationMatrix(0, 0, -this.cameraDist);
    this.gl.uniformMatrix4fv(this.viewMatLoc, false, viewMatrix);

    const projectionMatrix = Matrix.getPerspectiveProjectionMatrix(
      45 * (Math.PI / 180), // 45deg y-axis FOV
      this.canvas.width / this.canvas.height,
      0.1,
      this.cameraDist + 2000
    );
    this.gl.uniformMatrix4fv(this.projMatLoc, false, projectionMatrix);

    event.preventDefault();
    return false;
  };
}
