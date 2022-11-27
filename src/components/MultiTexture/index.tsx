import React, { useEffect, useRef } from "react";
import { initShaders } from "../../utils/index";
import sky from "../../assets/sky.jpg";
import circle from "../../assets/circle.gif";
function MultiTexture() {
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
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  varying vec2 v_TexCoord;
  void main() {
    vec4 color0 = texture2D(u_Sampler0, v_TexCoord);
    vec4 color1 = texture2D(u_Sampler1, v_TexCoord);
    gl_FragColor = color0 * color1;
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
      -0.5, 0.5, 0.0, 1.0,
      -0.5, -0.5, 0.0, 0.0,
      0.5, 0.5, 1.0, 1.0,
      0.5, -0.5, 1.0, 0.0,
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
    const texture0 = gl.createTexture();
    const texture1 = gl.createTexture();
    if (!texture0) {
      console.log("Failed to create the texture0 object.");
      return false;
    }
    if (!texture1) {
      console.log("Failed to create the texture1 object.");
      return false;
    }

    const u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
    if (!u_Sampler0) {
      console.log("Failed to get the storage location of u_Sampler0");
      return false;
    }
    const u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler1");
    if (!u_Sampler1) {
      console.log("Failed to get the storage location of u_Sampler1");
      return false;
    }
    const image0 = new Image();
    if (!image0) {
      console.log("Failed to create the image0 object");
      return false;
    }
    const image1 = new Image();
    if (!image1) {
      console.log("Failed to create the image0 object");
      return false;
    }
    image0.onload = function () {
      loadTexture(gl, n, texture0, u_Sampler0, image0, 0);
    };
    image1.onload = function () {
      loadTexture(gl, n, texture1, u_Sampler1, image1, 1);
    };
    image0.src = sky;
    image1.src = circle;
  }
  let g_texUnit0 = false,
    g_texUnit1 = false;
  function loadTexture(
    gl: WebGLRenderingContext & { program?: WebGLProgram },
    n: number,
    texture: WebGLTexture,
    u_sampler: WebGLUniformLocation,
    image: HTMLImageElement,
    texUnit: number
  ) {
    // 对纹理图像进行Y轴反转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    // 开启纹理单元
    if (texUnit === 0) {
      gl.activeTexture(gl.TEXTURE0);
      g_texUnit0 = true;
    } else {
      gl.activeTexture(gl.TEXTURE1);
      g_texUnit1 = true;
    }
    // 向target绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // 配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // 配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    // 把纹理传递给着色器
    gl.uniform1i(u_sampler, texUnit);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (g_texUnit0 && g_texUnit1) {
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    }
  }

  return (
    <canvas ref={canvasRef} id="example" width="400" height="400"></canvas>
  );
}

export default MultiTexture;
