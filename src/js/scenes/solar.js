import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {GUI} from "dat.gui";
import '../proto.js';
import {addCommonGUI} from "../common";

let scene, camera, renderer, controls, stats, gui

let time = 0;

const objects = [];

const radius = 1;
const widthSegments = 6;
const heightSegments = 6;
const sphereGeometry = new THREE.SphereGeometry(
  radius, widthSegments, heightSegments);

const solarSystem = new THREE.Object3D()

const sunMaterial = new THREE.MeshPhongMaterial({emissive: 0xFFFF00});
const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
sunMesh.scale.set(5, 5, 5);

const earthOrbit = new THREE.Object3D();
earthOrbit.position.x = 10;

const earthMaterial = new THREE.MeshPhongMaterial({color: 0x2233FF, emissive: 0x112244});
const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);

const moonOrbit = new THREE.Object3D();
moonOrbit.position.x = 2;

const moonMaterial = new THREE.MeshPhongMaterial({color: 0x888888, emissive: 0x222222});
const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
moonMesh.scale.set(.5, .5, .5);

objects.push(sunMesh);
objects.push(earthMesh)
objects.push(solarSystem)
objects.push(earthOrbit)
objects.push(moonMesh)

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
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 50, 0);
  camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene.add(solarSystem)
  solarSystem.add(sunMesh)
  solarSystem.add(earthOrbit)
  earthOrbit.add(earthMesh)
  earthOrbit.add(moonOrbit)
  moonOrbit.add(moonMesh)

  const color = 0xFFFFFF;
  const intensity = 3;
  const light = new THREE.PointLight(color, intensity);
  scene.add(light);

  controls = new OrbitControls(camera, renderer.domElement);

  addGUI();

  //resize
  window.addEventListener('resize', onResize, false);
  onResize();
  update();
}

function update() {
  requestAnimationFrame(update);

  time += 0.03;

  objects.forEach(el => {
    el.rotation.y = time;
  })

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