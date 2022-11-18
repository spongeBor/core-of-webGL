import React, { useEffect, useRef } from "react";
import { initShaders } from "../../utils/index";
import sky from "../../assets/sky.jpg";
function TexturedQuadRepeat() {
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
    initTextures(gl, n);
  }, []);

  // 顶点着色器
  const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_TexCoord;
  varying vec2 v_TexCoord;
  void main() {
    gl_Position = a_Position;
    v_TexCoord = a_TexCoord;
  }
  `;
  const FSHADER_SOURCE = `
  precision mediump float;
  uniform sampler2D u_Sampler;
  varying vec2 v_TexCoord;
  void main() {
    gl_FragColor = texture2D(u_Sampler, v_TexCoord);
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
    const verticesTexCoords = new Float32Array([
      -0.5, 0.5, -0.3, 1.7, -0.5, -0.5, -0.3, -0.2, 0.5, 0.5, 1.7, 1.7, 0.5,
      -0.5, 1.7, -0.2,
    ]);
    const n = 4;
    const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
    const vertexTexCoordBuffer = gl.createBuffer();

    if (!vertexTexCoordBuffer) {
      console.log("Failed to create the buffer object");
      return -1;
    }

    gl.clearColor(0, 0, 0, 1);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
    const a_Position = gl.getAttribLocation(gl.program, "a_Position");
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    const a_TexCoord = gl.getAttribLocation(gl.program, "a_TexCoord");
    gl.vertexAttribPointer(
      a_TexCoord,
      2,
      gl.FLOAT,
      false,
      FSIZE * 4,
      FSIZE * 2
    );
    gl.enableVertexAttribArray(a_TexCoord);

    return n;
  }

  function initTextures(
    gl: WebGLRenderingContext & { program?: WebGLProgram },
    n: number
  ) {
    const texture = gl.createTexture();
    if (!texture) {
      console.log("Failed to create the texture object.");
      return false;
    }

    const u_Sampler = gl.getUniformLocation(gl.program, "u_Sampler");
    if (!u_Sampler) {
      console.log("Failed to get the storage location of u_Sampler");
      return false;
    }
    const image = new Image();
    if (!image) {
      console.log("Failed to create the image object");
      return false;
    }
    image.onload = function () {
      loadTexture(gl, n, texture, u_Sampler, image);
    };
    image.src = sky;
  }

  function loadTexture(
    gl: WebGLRenderingContext & { program?: WebGLProgram },
    n: number,
    texture: WebGLTexture,
    u_sampler: WebGLUniformLocation,
    image: HTMLImageElement
  ) {
    // 对纹理图像进行Y轴反转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    // 开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0);
    // 向target绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // 配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    // 配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    // 把0号纹理传递给着色器
    gl.uniform1i(u_sampler, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
  }

  return (
    <canvas ref={canvasRef} id="example" width="400" height="400"></canvas>
  );
}

export default TexturedQuadRepeat;
