import React, { useEffect, useRef } from "react";
import { initShaders } from "../../utils/index";

function ClickPoint() {
  const canvasRef = useRef<HTMLCanvasElement>();
  const g_points: number[][] = [];
  const g_colors: number[][] = [];
  let canvas: HTMLCanvasElement;
  let gl: WebGLRenderingContext & { program?: WebGLProgram };
  useEffect(() => {
    canvas = canvasRef.current;
    gl = init(canvas);
    clearCanvas(gl);
  }, []);

  // 定点着色器
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
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
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

  const onClick = (
    e: React.MouseEvent<HTMLCanvasElement>,
    gl: WebGLRenderingContext & { program?: WebGLProgram }
  ) => {
    const { height, width } = canvas;
    const { clientX, clientY } = e;
    const { left, top } = (
      e.target as HTMLCanvasElement
    ).getBoundingClientRect();
    const x = (clientX - left - width / 2) / (width / 2);
    const y = (height / 2 - (clientY - top)) / (height / 2);
    const a_Position = gl.getAttribLocation(gl.program, "a_Position");
    const a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
    const u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
    if (a_Position < 0) {
      console.log("Failed to get the storage location of a_Position");
      return;
    }
    if (a_PointSize < 0) {
      console.log("Failed to get the storage location of a_PointSize");
      return;
    }
    if (!u_FragColor) {
      console.log("Failed to get u_FragColor variable");
      return;
    }
    g_points.push([x, y]);
    if (x >= 0.0 && y >= 0.0) {
      g_colors.push([1.0, 0.0, 0.0, 1.0]);
    } else if (x < 0.0 && y < 0.0) {
      g_colors.push([0.0, 1.0, 0.0, 1.0]);
    } else {
      g_colors.push([1.0, 1.0, 1.0, 1.0]);
    }
    const length = g_points.length;
    clearCanvas(gl);
    for (let i = 0; i < length; i++) {
      const xy = g_points[i];
      const rgba = g_colors[i];
      gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
      gl.vertexAttrib1f(a_PointSize, 10.0);
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      gl.drawArrays(gl.POINTS, 0, 1);
    }
  };
  return (
    <canvas
      ref={canvasRef}
      id="example"
      width="400"
      height="400"
      onClick={(e) => onClick(e, gl)}
    ></canvas>
  );
}

export default ClickPoint;
