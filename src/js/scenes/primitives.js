import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {GUI} from "dat.gui";
import '../proto.js';
import {addCommonGUI} from "../common";

const objectMap = {
  cube: undefined,
  sphere: undefined,
  cone: undefined,
  torus: undefined
}

const params = {
  currentObjectName: "cube",
  currentObject: undefined,
}

let scene, camera, renderer, controls, stats, gui, directionalLight, ambientLight;

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

  const lightFolder = gui.addFolder("light");
  const ambientLightFolder = lightFolder.addFolder("ambient");
  ambientLightFolder.add(ambientLight, 'intensity', 0, 3, 0.01);
  ambientLightFolder.addThreeColor(ambientLight, 'color');

  const directionalLightFolder = lightFolder.addFolder("directional");
  directionalLightFolder.add(directionalLight, 'intensity', 0, 3, 0.01)
  directionalLightFolder.addThreeColor(directionalLight, 'color')

  const objectFolder = gui.addFolder("object");
  objectFolder.add(params, 'currentObjectName', Object.keys(objectMap))
    .onChange(val => {
      params.currentObjectName = val;
      scene.remove(params.currentObject);
      params.currentObject = objectMap[val];
      scene.add(params.currentObject);
    });
  objectFolder.addThreeColor(params.currentObject.material, 'color')
}

function registerObjects() {
  const material = new THREE.MeshPhongMaterial({ color: 0xafe32a });

  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  objectMap.cube = new THREE.Mesh(boxGeometry, material);

  const coneGeometry = new THREE.ConeGeometry(1, 2, 32, 3);
  objectMap.cone = new THREE.Mesh(coneGeometry, material);

  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
  objectMap.sphere = new THREE.Mesh(sphereGeometry, material);

  const torusGeometry = new THREE.TorusGeometry(1, 0.4, 32, 32);
  objectMap.torus = new THREE.Mesh(torusGeometry, material);
}

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 3;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  registerObjects();

  params.currentObject = objectMap.cube ;
  scene.add(params.currentObject);

  directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
  directionalLight.position.set(-1, 2, 4);
  scene.add(directionalLight);

  ambientLight = new THREE.AmbientLight( 0x404040, 0.2);
  scene.add(ambientLight);

  controls = new OrbitControls(camera, renderer.domElement);

  addGUI();

  //resize
  window.addEventListener('resize', onResize, false);
  onResize();
  update();
}

function update() {
  requestAnimationFrame(update);

  params.currentObject.rotation.x += 0.01;
  params.currentObject.rotation.y += 0.01;
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

export {init as primitives}