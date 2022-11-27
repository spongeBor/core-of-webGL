import { Mat4} from "cuon-matrix-ts";
import React, { useEffect, useRef } from "react";

import { initShaders } from "../../utils/index";
function JointModel() {
  const canvasRef = useRef<HTMLCanvasElement>();
  let canvas: HTMLCanvasElement;
  let gl: WebGLRenderingContext & { program?: WebGLProgram };
  let ANGLE_STEP = 3.0;    // The increments of rotation angle (degrees)
  let g_arm1Angle = -90.0; // The rotation angle of arm1 (degrees)
  let g_joint1Angle = 0.0; // The rotation angle of joint1 (degrees)
  useEffect(() => {
    canvas = canvasRef.current;
    gl = init(canvas);
    const n = initVertexBuffers(gl);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    if (n < 0) {
      console.log("Failed to set the positions of the vertices");
      return;
    }
    const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    const u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    if (!u_MvpMatrix || !u_NormalMatrix) {
      console.log('Failed to get the storage location');
      return;
    }
    // Calculate the view projection matrix
    const viewProjMatrix = new Mat4();
    viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 100.0);
    viewProjMatrix.lookAt(20.0, 10.0, 30.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
    // Register the event handler to be called when keys are pressed
    document.onkeydown = function(ev){ 
      keydown(ev); 
    };

    draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);  // Draw the robot arm

    function keydown(ev:any) {
      switch (ev.keyCode) {
        case 38: // Up arrow key -> the positive rotation of joint1 around the z-axis
          if (g_joint1Angle < 135.0) g_joint1Angle += ANGLE_STEP;
          break;
        case 40: // Down arrow key -> the negative rotation of joint1 around the z-axis
          if (g_joint1Angle > -135.0) g_joint1Angle -= ANGLE_STEP;
          break;
        case 39: // Right arrow key -> the positive rotation of arm1 around the y-axis
          g_arm1Angle = (g_arm1Angle + ANGLE_STEP) % 360;
          break;
        case 37: // Left arrow key -> the negative rotation of arm1 around the y-axis
          g_arm1Angle = (g_arm1Angle - ANGLE_STEP) % 360;
          break;
        default: return; // Skip drawing at no effective action
      }
      // Draw the robot arm
      draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
    }
  }, []);

  // 顶点着色器
  const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Normal;
  uniform mat4 u_MvpMatrix;
  uniform mat4 u_NormalMatrix; // 用来变换法向量的矩阵
  varying vec4 v_Color;
  void main() {
    gl_Position = u_MvpMatrix * a_Position;
    vec3 lightDirection = normalize(vec3(0.0, 0.5, 0.7));
    vec4 color = vec4(1.0, 0.4, 0.0, 1.0);
    vec3 normal = normalize((u_NormalMatrix * a_Normal).xyz);
    float nDotL = max(dot(normal, lightDirection), 0.0);
    v_Color = vec4(color.rgb * nDotL + vec3(0.1), color.a);
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
    const vertices = new Float32Array([
      1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5,  0.0, 1.5,  1.5,  0.0, 1.5, // v0-v1-v2-v3 front
      1.5, 10.0, 1.5,  1.5,  0.0, 1.5,  1.5,  0.0,-1.5,  1.5, 10.0,-1.5, // v0-v3-v4-v5 right
      1.5, 10.0, 1.5,  1.5, 10.0,-1.5, -1.5, 10.0,-1.5, -1.5, 10.0, 1.5, // v0-v5-v6-v1 up
     -1.5, 10.0, 1.5, -1.5, 10.0,-1.5, -1.5,  0.0,-1.5, -1.5,  0.0, 1.5, // v1-v6-v7-v2 left
     -1.5,  0.0,-1.5,  1.5,  0.0,-1.5,  1.5,  0.0, 1.5, -1.5,  0.0, 1.5, // v7-v4-v3-v2 down
      1.5,  0.0,-1.5, -1.5,  0.0,-1.5, -1.5, 10.0,-1.5,  1.5, 10.0,-1.5  // v4-v7-v6-v5 back
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
  const g_modelMatrix = new Mat4();
  function draw(
    gl: WebGLRenderingContext & { program?: WebGLProgram },
  n:number,
  viewProjMatrix:Mat4,
  u_MvpMatrix:WebGLUniformLocation,
  u_NormalMatrix:WebGLUniformLocation
  ) {
    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Arm1
    const arm1Length = 10.0; // Length of arm1
    g_modelMatrix.setTranslate(0.0, -12.0, 0.0);
    g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0);    // Rotate around the y-axis
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  
    // Arm2
    g_modelMatrix.translate(0.0, arm1Length, 0.0); 　　　// Move to joint1
    g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0);  // Rotate around the z-axis
    g_modelMatrix.scale(1.3, 1.0, 1.3); // Make it a little thicker
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
  }
  // Draw the cube
function drawBox(
  gl: WebGLRenderingContext & { program?: WebGLProgram },
  n:number,
  viewProjMatrix:Mat4,
  u_MvpMatrix:WebGLUniformLocation,
  u_NormalMatrix:WebGLUniformLocation
  ) {
  const g_mvpMatrix = new Mat4();
  const g_normalMatrix = new Mat4(); // Coordinate transformation matrix for normals
  
  // Calculate the model view project matrix and pass it to u_MvpMatrix
  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
  // Calculate the normal transformation matrix and pass it to u_NormalMatrix
  g_normalMatrix.setInverseOf(g_modelMatrix);
  g_normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
  // Draw
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}
  return (
    <>
    <canvas ref={canvasRef} id="example" width="400" height="400"></canvas>
    <p>&larr;&rarr;: arm1 rotation(y-axis), &uarr;&darr;: joint1 rotation(z-axis)</p>
    </>
  );
}

export default JointModel;
