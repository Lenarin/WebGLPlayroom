import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {GUI} from "dat.gui";
import '../proto.js';
import {addCommonGUI} from "../common";

const loader = new THREE.TextureLoader();

loader.load()

const textures = [
  loader.load('images/1.jpg'),
  loader.load('images/2.jpg'),
  loader.load('images/3.png'),
]

const filters = {
  "nearest": THREE.NearestFilter,
  "linear": THREE.LinearFilter,
  "NMN": THREE.NearestMipmapNearestFilter,
  "NML": THREE.NearestMipmapLinearFilter,
  "LMN": THREE.LinearMipmapNearestFilter,
  "LML": THREE.LinearMipmapLinearFilter
}

const objectMap = {
  cube: undefined,
  sphere: undefined,
  cone: undefined,
  torus: undefined,
}

const params = {
  currentObjectName: "cube",
  currentObject: undefined,
  currentMaterial: "phong",
  currentTexture: 0,
  currentFilter: "nearest",
  showLightHelper: false
}

const materials = {
  "phong": new THREE.MeshPhongMaterial({ color: 0xafe32a, map: textures[params.currentTexture] }),
  "basic": new THREE.MeshBasicMaterial({ color: 0xafe32a, map: textures[params.currentTexture] }),
  "depth": new THREE.MeshDepthMaterial({ color: 0xafe32a, map: textures[params.currentTexture] }),
  "normal": new THREE.MeshNormalMaterial({ color: 0xafe32a, map: textures[params.currentTexture] }),
  "toon": new THREE.MeshToonMaterial({ color: 0xafe32a, map: textures[params.currentTexture] }),
}

let scene, camera, renderer, controls, stats, gui, directionalLight, ambientLight, lightHelper;

function drawPlane() {
  const planeSize = 40;

  const planeTexture = loader.load('images/4.png')
  planeTexture.wrapS = THREE.RepeatWrapping;
  planeTexture.wrapT = THREE.RepeatWrapping;
  planeTexture.magFilter = THREE.NearestFilter;
  const repeats = planeSize / 2;
  planeTexture.repeat.set(repeats, repeats);

  const geo = new THREE.PlaneGeometry(planeSize, planeSize);
  const mat = new THREE.MeshPhongMaterial({map: planeTexture, side: THREE.DoubleSide})
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(0, -1, 0)
  mesh.rotateX(Math.PI * -0.5)
  scene.add(mesh);
}

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
  directionalLightFolder.add(lightHelper, 'visible')
  directionalLightFolder.add(directionalLight.position, 'x', -10, 10, 0.01)
    .onChange(() => {
      directionalLight.target.updateMatrixWorld();
      lightHelper.update()
    })
  directionalLightFolder.add(directionalLight.position, 'y', -10, 10, 0.01)
    .onChange(() => {
      directionalLight.target.updateMatrixWorld();
      lightHelper.update()
    })
  directionalLightFolder.add(directionalLight.position, 'z', -10, 10, 0.01)
    .onChange(() => {
      directionalLight.target.updateMatrixWorld();
      lightHelper.update()
    })
  directionalLightFolder.add(directionalLight, 'intensity', 0, 3, 0.01)
  directionalLightFolder.addThreeColor(directionalLight, 'color')

  const objectFolder = gui.addFolder("object");
  objectFolder.add(params, 'currentObjectName', Object.keys(objectMap))
    .onChange(val => {
      params.currentObjectName = val;
      scene.remove(params.currentObject);
      params.currentObject = objectMap[val];
      scene.add(params.currentObject);
      params.currentObject.material = materials[params.currentMaterial]
      params.currentObject.material.map = textures[params.currentTexture]
    });
  objectFolder.add(params, 'currentMaterial', Object.keys(materials))
    .onChange(val => {
      params.currentMaterial = val;
      params.currentObject.material = materials[val]
      params.currentObject.material.map = textures[params.currentTexture]
    })
  objectFolder.add(params, 'currentTexture', textures.map((el, idx) => idx))
    .onChange(val => {
      params.currentTexture = val;
      params.currentObject.material.map = textures[val]
    })
  objectFolder.add(params, 'currentFilter', Object.keys(filters))
    .onChange(val => {
      params.currentFilter = val;
      params.currentObject.material.map.minFilter = filters[val]
    })
  objectFolder.addThreeColor(params.currentObject.material, 'color')
}

function registerObjects() {
  const material = materials[params.currentMaterial]

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
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 3;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  registerObjects();

  params.currentObject = objectMap.cube ;
  scene.add(params.currentObject);

  directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
  directionalLight.position.set(-1, 2, 4);
  directionalLight.target.position.set(0,0,0)
  scene.add(directionalLight);

  lightHelper = new THREE.DirectionalLightHelper(directionalLight);
  lightHelper.visible = false;
  scene.add(lightHelper)

  ambientLight = new THREE.AmbientLight( 0x404040, 0.2);
  scene.add(ambientLight);

  controls = new OrbitControls(camera, renderer.domElement);

  addGUI();
  drawPlane();

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