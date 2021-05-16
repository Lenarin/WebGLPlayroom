import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {GUI} from "dat.gui";
import '../proto.js';
import {addCommonGUI} from "../common";

let scene, camera, renderer, controls, stats, gui

function addGUI() {
  stats = new Stats();
  document.body.appendChild(stats.dom);

  gui = new GUI();

  addCommonGUI(gui);

  const cameraFolder = gui.addFolder("camera");
  cameraFolder.add(camera, 'fov', 60, 120, 1)
    .onChange(() => camera.updateProjectionMatrix());
  cameraFolder.add(camera, 'near', 0.1, 1000, 0.1)
    .onChange(() => camera.updateProjectionMatrix());
  cameraFolder.add(camera, 'far', 0.1, 1000, 0.1)
    .onChange(() => camera.updateProjectionMatrix());
}

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 50, 0);
  camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);

  addGUI();

  //resize
  window.addEventListener('resize', onResize, false);
  onResize();
  update();
}

function update() {
  requestAnimationFrame(update);

  renderer.render(scene, camera);
  stats.update();
  controls.update();
}

function onResize() {
  let w = window.innerWidth;
  let h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  renderer.setPixelRatio(window.devicePixelRatio);
}

export {init as solar}