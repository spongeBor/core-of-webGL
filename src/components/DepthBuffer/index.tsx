import { Mat4 } from "cuon-matrix-ts";
import React, { useEffect, useRef } from "react";
import { initShaders } from "../../utils/index";
function DepthBuffer() {
  const canvasRef = useRef<HTMLCanvasElement>();
  let canvas: HTMLCanvasElement;
  let gl: WebGLRenderingContext & { program?: WebGLProgram };
  useEffect(() => {
    canvas = canvasRef.current;
    gl = init(canvas);
    const n = initVertexBuffers(gl);
    gl.clearColor(0, 0, 0, 1);
    if (n < 0) {
      console.log("Failed to set the positions of the vertices");
      return;
    }
    const u_MvpMatrix = gl.getUniformLocation(gl.program, "u_MvpMatrix");
    if (!u_MvpMatrix) {
      console.log("Failed to get the storage location of u_MvpMatrix");
      return;
    }
    const modelMatrix = new Mat4();
    const viewMatrix = new Mat4();
    const projMatrix = new Mat4();
    const mvpMatrix = new Mat4();

    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    modelMatrix.setTranslate(0.75, 0, 0);
    viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
    projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, n);

    modelMatrix.setTranslate(-0.75, 0, 0);
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }, []);

  // 顶点着色器
  const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_MvpMatrix;
  varying vec4 v_Color;
  void main() {
    gl_Position = u_MvpMatrix * a_Position;
    v_Color = a_Color;
  }
  `;
  const FSHADER_SOURCE = `
  precision mediump float;
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
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
    const verticesColors = new Float32Array([
      // Vertex coordinates and color
      0.0,
      1.0,
      0.0,
      0.4,
      0.4,
      1.0, // The front blue one
      -0.5,
      -1.0,
      0.0,
      0.4,
      0.4,
      1.0,
      0.5,
      -1.0,
      0.0,
      1.0,
      0.4,
      0.4,

      0.0,
      1.0,
      -2.0,
      1.0,
      1.0,
      0.4, // The middle yellow one
      -0.5,
      -1.0,
      -2.0,
      1.0,
      1.0,
      0.4,
      0.5,
      -1.0,
      -2.0,
      1.0,
      0.4,
      0.4,

      0.0,
      1.0,
      -4.0,
      0.4,
      1.0,
      0.4, // The back green one
      -0.5,
      -1.0,
      -4.0,
      0.4,
      1.0,
      0.4,
      0.5,
      -1.0,
      -4.0,
      1.0,
      0.4,
      0.4,
    ]);
    const n = 9;
    const vertexColorBuffer = gl.createBuffer();
    if (!vertexColorBuffer) {
      console.log("Failed to create the buffer object");
      return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    const FSIZE = verticesColors.BYTES_PER_ELEMENT;
    const a_Position = gl.getAttribLocation(gl.program, "a_Position");
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);
    const a_Color = gl.getAttribLocation(gl.program, "a_Color");
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    return n;
  }

  return (
    <canvas ref={canvasRef} id="example" width="400" height="400"></canvas>
  );
}

export default DepthBuffer;
