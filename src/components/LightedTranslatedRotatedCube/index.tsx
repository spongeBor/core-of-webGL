import { Mat4, Vec3 } from "cuon-matrix-ts";
import React, { useEffect, useRef } from "react";

import { initShaders } from "../../utils/index";
function LightedTranslatedRotatedCube() {
  const canvasRef = useRef<HTMLCanvasElement>();
  let canvas: HTMLCanvasElement;
  let gl: WebGLRenderingContext & { program?: WebGLProgram };
  useEffect(() => {
    canvas = canvasRef.current;
    gl = init(canvas);
    const n = initVertexBuffers(gl);
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    if (n < 0) {
      console.log("Failed to set the positions of the vertices");
      return;
    }
    const u_MvpMatrix = gl.getUniformLocation(gl.program, "u_MvpMatrix");
    const u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    const u_LightColor = gl.getUniformLocation(gl.program, "u_LightColor");
    const u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
    const u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
    // 设置光线颜色
    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    // 设置光线方向（世界坐标系下）
    const lightDirection = new Vec3(0.0, 3.0, 4.0);
    lightDirection.normalize();
    gl.uniform3fv(u_LightDirection, lightDirection.elements);
    // 设置环境光颜色
    gl.uniform3f(u_AmbientLight, 0.2,0.2,0.2);
    const mvpMatrix = new Mat4();
    const modelMatrix = new Mat4();
    const normalMatrix = new Mat4();
    //计算模式矩阵
    modelMatrix.setTranslate(0, 0.9, 0);
    modelMatrix.rotate(90, 0, 0, 1);
    // 计算模式视图投影矩阵
    mvpMatrix.setPerspective(30, 1, 1, 100);
    mvpMatrix.lookAt(3,3,7,0,0,0,0,1,0);
    mvpMatrix.multiply(modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    // 根据模型矩阵，计算用来变换法微量的矩阵
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

  }, []);

  // 顶点着色器
  const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  attribute vec4 a_Normal; // 法向量
  uniform mat4 u_MvpMatrix;
  uniform mat4 u_NormalMatrix; // 用来变换法向量的矩阵
  uniform vec3 u_LightColor; // 光线颜色
  uniform vec3 u_LightDirection; // 归一化的世界坐标
  uniform vec3 u_AmbientLight; // 环境光颜色
  varying vec4 v_Color;
  void main() {
    gl_Position = u_MvpMatrix * a_Position;
    // 计算变换后的法向量并归一化
    vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
    // 计算光线方向和法向量的点积
    float nDotL = max(dot(u_LightDirection, normal), 0.0);
    // 计算漫反射光的颜色
    vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;
    // 计算环境光的反射光颜色
    vec3 ambient = u_AmbientLight * a_Color.rgb;
    // 两者相加得到物体的最终颜色
    v_Color = vec4(diffuse + ambient, a_Color.a);
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
      // Create a cube
      //    v6----- v5
      //   /|      /|
      //  v1------v0|
      //  | |     | |
      //  | |v7---|-|v4
      //  |/      |/
      //  v2------v3
    const vertices = new Float32Array([   // Vertex coordinates
        1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
        1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
        -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
        1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
    ]);
    const colors = new Float32Array([    // Colors
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　    // v4-v7-v6-v5 back
    ]);
    const normals = new Float32Array([    // Normal
        0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
        0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
      -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
        0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
        0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
      ]);
    // Indices of the vertices
    const indices =new Uint8Array([       // Indices of the vertices
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
        12,13,14,  12,14,15,    // left
        16,17,18,  16,18,19,    // down
        20,21,22,  20,22,23     // back
    ]);
    
    const indexBuffer = gl.createBuffer();
    if (!indexBuffer) 
    return -1;
  // Write the vertex coordinates and color to the buffer object
  if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position'))
  return -1;

  if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color'))
  return -1;

  if (!initArrayBuffer(gl, normals, 3, gl.FLOAT, 'a_Normal'))
  return -1;
  // Write the indices to the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
  }
  function initArrayBuffer(
      gl: WebGLRenderingContext & { program?: WebGLProgram },
      data:Float32Array,
      num: number,
      type:number,
      attribute:string
    ) {
    var buffer = gl.createBuffer();   // Create a buffer object
    if (!buffer) {
      console.log('Failed to create the buffer object');
      return false;
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // Assign the buffer object to the attribute variable
    var a_attribute = gl.getAttribLocation(gl.program, attribute);
    if (a_attribute < 0) {
      console.log('Failed to get the storage location of ' + attribute);
      return false;
    }
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    // Enable the assignment of the buffer object to the attribute variable
    gl.enableVertexAttribArray(a_attribute);
  
    return true;
  }

  return (
    <canvas ref={canvasRef} id="example" width="400" height="400"></canvas>
  );
}

export default LightedTranslatedRotatedCube;
