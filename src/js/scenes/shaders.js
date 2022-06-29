import {GUI} from "dat.gui";
import '../proto.js';
import {addCommonGUI} from "../common";

import {shaders} from './shaders/index';


let gui, PROGRAM, CANVAS, GL;

const params = {
  curShader: Object.keys(shaders)[Object.keys(shaders).length - 1]
}

function addGUI() {
  gui = new GUI();

  addCommonGUI(gui);

  const shaderFolder = gui.addFolder("shader");
  shaderFolder.add(params, 'curShader', Object.keys(shaders))
    .onChange(val => {
      params.curShader = val;
      canvasMain();
    })
}

function init() {
  CANVAS = document.getElementById("canvas");
  GL = CANVAS.getContext('webgl');

  addGUI();
  canvasMain();
}

function canvasMain() {
  clearCanvas();
  createPlane();
  createProgram();
  updateCanvasSize();
  initEventListeners();
  createTextures();
  draw();
}

function clearCanvas() {
  GL.clearColor(0.26, 1, 0.93, 1.0);
  GL.clear(GL.COLOR_BUFFER_BIT);
}

function createPlane() {
  GL.bindBuffer(GL.ARRAY_BUFFER, GL.createBuffer());
  GL.bufferData(
    GL.ARRAY_BUFFER,
    new Float32Array([
      -1, -1,
      -1,  1,
      1, -1,
      1,  1
    ]),
    GL.STATIC_DRAW
  );
}


function createProgram() {
  const computedShaders = getShaders();

  PROGRAM = GL.createProgram();

  GL.attachShader(PROGRAM, computedShaders.vertex);
  GL.attachShader(PROGRAM, computedShaders.fragment);
  GL.linkProgram(PROGRAM);

  const vertexPositionAttribute = GL.getAttribLocation(PROGRAM, 'a_position');

  GL.enableVertexAttribArray(vertexPositionAttribute);
  GL.vertexAttribPointer(vertexPositionAttribute, 2, GL.FLOAT, false, 0, 0);

  if (shaders[params.curShader] && shaders[params.curShader].init)
  {
    shaders[params.curShader].init(GL, PROGRAM);
  }

  GL.useProgram(PROGRAM);
}


function getShaders() {
  return {
    vertex: compileShader(
      GL.VERTEX_SHADER,
      shaders[params.curShader].vertex
    ),
    fragment: compileShader(
      GL.FRAGMENT_SHADER,
      shaders[params.curShader].fragment
    )
  };
}

function createTextures() {
  const textures = ['images/flower.jpg', 'images/forest.jpg', 'images/sea.jpg'];

  for (let i = 0; i < textures.length; i++) {
    createTexture(i, textures[i]);
  }
}

function createTexture(index, src) {
  const image = new Image();

  image.onload = () => {
    const texture = GL.createTexture();

    GL.activeTexture(GL['TEXTURE' + index]);
    GL.bindTexture(GL.TEXTURE_2D, texture);

    GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGB, GL.RGB, GL.UNSIGNED_BYTE, image);

    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);

    GL.uniform1i(GL.getUniformLocation(PROGRAM, 'u_textures[' + index + ']'), index);
  }
  image.src = src;
}


function compileShader(type, source) {
  const shader = GL.createShader(type);

  GL.shaderSource(shader, source);
  GL.compileShader(shader);

  return shader;
}


function updateCanvasSize() {
  const size = Math.ceil(Math.min(window.innerHeight, window.innerWidth) * .9) - 30;

  CANVAS.height = size;
  CANVAS.width = size;

  GL.uniform1f(GL.getUniformLocation(PROGRAM, 'u_canvas_size'),
    Math.max(CANVAS.height, CANVAS.width));

  GL.viewport(0, 0, GL.canvas.width, GL.canvas.height);
}


function initEventListeners() {
  window.addEventListener('resize', updateCanvasSize);
}


function draw(timeStamp) {
  GL.uniform1f(GL.getUniformLocation(PROGRAM, 'u_time'), timeStamp / 1000.0);

  if (shaders[params.curShader] && shaders[params.curShader].update) {
    shaders[params.curShader].update(GL, PROGRAM, timeStamp);
  }

  GL.drawArrays(GL.TRIANGLE_STRIP, 0, 4);

  requestAnimationFrame(draw);
}


export {init as shadersScene}