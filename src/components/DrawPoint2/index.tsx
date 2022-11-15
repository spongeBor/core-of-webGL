import React, { useEffect, useRef } from "react";
import { initShaders } from "../../utils/index";

function DrawPoint2() {
  const canvasRef = useRef<HTMLCanvasElement>();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("Failed to retrieve the canvas element");
    }
    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.log("Failed to get the rendering context for WebGL");
      return;
    }
    drawPoint2(gl);
  }, []);

  const clearCanvas = (gl: WebGLRenderingContext) => {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  };
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
  void main() {
    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
  }
  `;
  const drawPoint2 = (
    gl: WebGLRenderingContext & { program?: WebGLProgram }
  ) => {
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log("Failed to initialize shaders");
      return;
    }
    const a_Position = gl.getAttribLocation(gl.program, "a_Position");
    const a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
    if (a_Position < 0) {
      console.log("Failed to get the storage location of a_Position");
      return;
    }
    if (a_PointSize < 0) {
      console.log("Failed to get the storage location of a_PointSize");
      return;
    }
    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
    gl.vertexAttrib1f(a_PointSize, 10.0);
    clearCanvas(gl);
    gl.drawArrays(gl.POINTS, 0, 1);
  };
  return (
    <canvas ref={canvasRef} id="example" width="400" height="400"></canvas>
  );
}

export default DrawPoint2;
