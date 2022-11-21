import React, { useEffect, useRef } from "react";
import { initShaders } from "../../utils/index";
function LookAtTriangles() {
  const canvasRef = useRef<HTMLCanvasElement>();
  let canvas: HTMLCanvasElement;
  let gl: WebGLRenderingContext & { program?: WebGLProgram };
  useEffect(() => {
    canvas = canvasRef.current;
    gl = init(canvas);
    const n = initVertexBuffers(gl);
    if (n < 0) {
      console.log("Failed to set the positions of the vertices");
      return;
    }

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
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
      // 顶点坐标和颜色
      0.0,
      0.5,
      -0.4,
      0.4,
      1.0,
      0.4, // 绿 最后
      -0.5,
      -0.5,
      -0.4,
      0.4,
      1.0,
      0.4,
      0.5,
      -0.5,
      -0.4,
      1.0,
      0.4,
      0.4,

      0.5,
      0.4,
      -0.2,
      1.0,
      0.4,
      0.4, // 黄 中间
      -0.5,
      0.4,
      -0.2,
      1.0,
      1.0,
      0.4,
      0.0,
      -0.6,
      -0.2,
      1.0,
      1.0,
      0.4,

      0.0,
      0.5,
      0.5,
      0.4,
      0.4,
      1.0, // 蓝 前面i
      -0.5,
      -0.5,
      0.0,
      0.4,
      0.4,
      1.0,
      0.5,
      -0.5,
      0.0,
      1.0,
      0.4,
      0.4,
    ]);
    const n = 3;
    const FSIZE = verticesColors.BYTES_PER_ELEMENT;
    const vertexColorBuffer = gl.createBuffer();

    if (!vertexColorBuffer) {
      console.log("Failed to create the buffer object");
      return -1;
    }

    gl.clearColor(0, 0, 0, 1);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
    const a_Position = gl.getAttribLocation(gl.program, "a_Position");
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
    gl.enableVertexAttribArray(a_Position);
    const a_Color = gl.getAttribLocation(gl.program, "a_Color");
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    gl.enableVertexAttribArray(a_Color);

    return n;
  }

  return (
    <canvas ref={canvasRef} id="example" width="400" height="400"></canvas>
  );
}

export default LookAtTriangles;
