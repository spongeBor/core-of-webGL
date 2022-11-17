import React, { useEffect, useRef } from "react";
import { initShaders } from "../../utils/index";
import { Mat4 } from "cuon-matrix-ts";
function RotatingTriangles() {
  const canvasRef = useRef<HTMLCanvasElement>();
  let canvas: HTMLCanvasElement;
  let gl: WebGLRenderingContext & { program?: WebGLProgram };
  const ANGLE_STEP = 45.0;
  let currentAngle = 0.0;
  let modelMatrix = new Mat4();
  useEffect(() => {
    canvas = canvasRef.current;
    gl = init(canvas);
    const n = initVertexBuffers(gl);
    if (n < 0) {
      console.log("Failed to set the positions of the vertices");
      return;
    }
    const u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
    const tick = () => {
      currentAngle = animate(currentAngle);
      draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
      requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);
  }, []);

  // 顶点着色器
  const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  void main() {
    gl_Position = u_ModelMatrix * a_Position;
  }
  `;

  const FSHADER_SOURCE = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
  }
  `;
  const init = (canvas: HTMLCanvasElement) => {
    if (!canvas) {
      console.log("Failed to retrieve the canvas element");
    }
    const gl: WebGLRenderingContext & { program?: WebGLProgram } =
      canvas.getContext("webgl");
    if (!gl) {
      console.log("Failed to get the rendering context for WebGL");
      return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log("Failed to initialize shaders");
      return;
    }
    return gl;
  };

  function initVertexBuffers(
    gl: WebGLRenderingContext & { program?: WebGLProgram }
  ) {
    const vertices = new Float32Array([0.0, 0.3, -0.3, -0.3, 0.3, -0.3]);
    const n = 3;
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log("Failed to create the buffer object");
      return -1;
    }
    gl.clearColor(0, 0, 0, 1);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const a_Position = gl.getAttribLocation(gl.program, "a_Position");
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    return n;
  }
  function draw(
    gl: WebGLRenderingContext & { program?: WebGLProgram },
    n: number,
    currentAngle: number,
    modelMatrix: Mat4,
    u_ModelMatrix: WebGLUniformLocation
  ) {
    modelMatrix.setRotate(currentAngle, 0, 0, 1);
    modelMatrix.translate(0.35, 0.0, 0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }
  let g_last = Date.now();
  function animate(angle: number) {
    const now = Date.now();
    const elapsed = now - g_last;
    g_last = now;
    let newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    return (newAngle %= 360);
  }
  return (
    <canvas ref={canvasRef} id="example" width="400" height="400"></canvas>
  );
}

export default RotatingTriangles;
