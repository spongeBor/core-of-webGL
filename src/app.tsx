import React, { useEffect, useRef } from "react";

function App() {
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
    clearCanvas(gl);
  }, []);

  const clearCanvas = (gl: WebGLRenderingContext) => {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  };
  // 定点着色器
  const VSHADER_SOURCE = `void main() {
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
    gl_PointSize = 10.0;
  }`;
  const FSHADER_SOURCE = `void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }`;
  const drawPoint1 = (gl: WebGLRenderingContext) => {};
  return (
    <canvas ref={canvasRef} id="example" width="400" height="400"></canvas>
  );
}

export default App;
