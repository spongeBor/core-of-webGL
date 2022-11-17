import React, { useEffect, useRef } from "react";
import { initShaders } from "../../utils/index";
import { Mat4 } from "cuon-matrix-ts";
function MultiAttributeSizeInterleaved() {
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
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, n);
  }, []);

  // 顶点着色器
  const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute float a_PointSize;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
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
    const verticesSizes = new Float32Array([
      0.0, 0.5, 10.0, -0.5, -0.5, 20.0, 0.5, -0.5, 30.0,
    ]);
    const n = 3;
    const FSIZE = verticesSizes.BYTES_PER_ELEMENT;
    const vertexBuffer = gl.createBuffer();
    const sizeBuffer = gl.createBuffer();

    if (!vertexBuffer || !sizeBuffer) {
      console.log("Failed to create the buffer object");
      return -1;
    }

    gl.clearColor(0, 0, 0, 1);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);
    const a_Position = gl.getAttribLocation(gl.program, "a_Position");
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);
    gl.enableVertexAttribArray(a_Position);
    const a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
    gl.vertexAttribPointer(
      a_PointSize,
      1,
      gl.FLOAT,
      false,
      FSIZE * 3,
      FSIZE * 2
    );
    gl.enableVertexAttribArray(a_PointSize);

    return n;
  }

  return (
    <canvas ref={canvasRef} id="example" width="400" height="400"></canvas>
  );
}

export default MultiAttributeSizeInterleaved;
