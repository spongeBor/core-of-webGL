import { Mat4 } from "cuon-matrix-ts";
import React, { useEffect, useRef } from "react";
import { initShaders } from "../../utils/index";
function LookAtTrianglesWithKeys() {
  const canvasRef = useRef<HTMLCanvasElement>();
  let canvas: HTMLCanvasElement;
  let gl: WebGLRenderingContext & { program?: WebGLProgram };
  let g_eyeX = 0.2,
    g_eyeY = 0.25,
    g_eyeZ = 0.25;
  useEffect(() => {
    canvas = canvasRef.current;
    gl = init(canvas);
    const n = initVertexBuffers(gl);
    gl.clearColor(0, 0, 0, 1);
    if (n < 0) {
      console.log("Failed to set the positions of the vertices");
      return;
    }
    const u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
    if (!u_ViewMatrix) {
      console.log("Failed to get the storage locations of u_ViewMatrix");
      return;
    }
    const viewMatrix = new Mat4();
    draw(gl, n, u_ViewMatrix, viewMatrix);
    const onkeydown = (e: any) => {
      if (e.code === "ArrowLeft") {
        g_eyeX -= 0.02;
        draw(gl, n, u_ViewMatrix, viewMatrix);
      } else if (e.code === "ArrowRight") {
        g_eyeX += 0.02;
        draw(gl, n, u_ViewMatrix, viewMatrix);
      }
    };
    document.onkeydown = onkeydown;
  }, []);

  // 顶点着色器
  const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_ViewMatrix;
  varying vec4 v_Color;
  void main() {
    gl_Position = u_ViewMatrix * a_Position;
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
      // Vertex coordinates and color(RGBA)
      0.0, 0.5, -0.4, 0.4, 1.0, 0.4, // The back green one
      -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
      0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

      0.5, 0.4, -0.2, 1.0, 0.4, 0.4, // The middle yellow one
      -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
      0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

      0.0, 0.5, 0.0, 0.4, 0.4, 1.0, // The front blue one
      -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
      0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
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

  const draw = (
    gl: WebGLRenderingContext & { program?: WebGLProgram },
    n: number,
    u_ViewMatrix: WebGLUniformLocation,
    viewMatrix: Mat4
  ) => {
    viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
  };

  return (
    <canvas ref={canvasRef} id="example" width="400" height="400"></canvas>
  );
}

export default LookAtTrianglesWithKeys;
