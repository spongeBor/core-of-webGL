import React, { useEffect, useRef } from "react";
import { initShaders } from "../../utils/index";

function RotatedTriangle() {
  const canvasRef = useRef<HTMLCanvasElement>();
  let canvas: HTMLCanvasElement;
  let gl: WebGLRenderingContext & { program?: WebGLProgram };
  const ANGLE = 90.0;
  const radian = (Math.PI * ANGLE) / 180.0;
  const cosB = Math.cos(radian);
  const sinB = Math.sin(radian);
  useEffect(() => {
    canvas = canvasRef.current;
    gl = init(canvas);
    const n = initVertexBuffers(gl);
    if (n < 0) {
      console.log("Failed to set the positions of the vertices");
      return;
    }
    const u_CosB = gl.getUniformLocation(gl.program, "u_CosB");
    const u_SinB = gl.getUniformLocation(gl.program, "u_SinB");
    gl.uniform1f(u_CosB, cosB);
    gl.uniform1f(u_SinB, sinB);
    clearCanvas(gl);
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }, []);

  // 顶点着色器
  const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_CosB, u_SinB;
  void main() {
    gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;
    gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;
    gl_Position.z = a_Position.z;
    gl_Position.w = 1.0;
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
  const clearCanvas = (gl: WebGLRenderingContext) => {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  };

  function initVertexBuffers(
    gl: WebGLRenderingContext & { program?: WebGLProgram }
  ) {
    const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    const n = 3;
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log("Failed to create the buffer object");
      return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const a_Position = gl.getAttribLocation(gl.program, "a_Position");
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    return n;
  }

  return (
    <canvas ref={canvasRef} id="example" width="400" height="400"></canvas>
  );
}

export default RotatedTriangle;
