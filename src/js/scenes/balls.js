import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {GUI} from "dat.gui";
import '../proto.js';
import {addCommonGUI} from "../common";
import {randFloat} from "three/src/math/MathUtils";

const loader = new THREE.TextureLoader();

loader.load()

let scene, camera, renderer, controls, stats, gui, ambientLight;

let sphereSpeed = 2.5;
const sphereRadius = .5;
const boxOffset = 5;

const clock = new THREE.Clock();

const spheres = [];
const planes = [];

function drawPlane() {
  const planeSize = boxOffset * 2;

  const planeTexture = loader.load('images/4.png')
  planeTexture.wrapS = THREE.RepeatWrapping;
  planeTexture.wrapT = THREE.RepeatWrapping;
  planeTexture.magFilter = THREE.NearestFilter;
  const repeats = planeSize / 2;
  planeTexture.repeat.set(repeats, repeats);

  const geo = new THREE.PlaneGeometry(planeSize, planeSize);
  geo.computeBoundingBox();
  const mat = new THREE.MeshPhongMaterial({map: planeTexture, side: THREE.DoubleSide })
  mat.color.setRGB(1.5, 1.5, 1.5)

  const meshFloor = new THREE.Mesh(geo, mat);
  meshFloor.position.set(0, -boxOffset, 0)
  meshFloor.rotateX(Math.PI * -0.5)
  scene.add(meshFloor);
  planes.push(meshFloor)

  const meshCeil = new THREE.Mesh(geo, mat);
  meshCeil.position.set(0, boxOffset, 0)
  meshCeil.rotateX(Math.PI * -0.5)
  scene.add(meshCeil);
  planes.push(meshCeil)

  const MeshWest = new THREE.Mesh(geo, mat);
  MeshWest.position.set(-boxOffset, 0, 0)
  MeshWest.rotateY(Math.PI * -0.5)
  scene.add(MeshWest);
  planes.push(MeshWest)

  const MeshEast = new THREE.Mesh(geo, mat);
  MeshEast.position.set(boxOffset, 0, 0)
  MeshEast.rotateY(Math.PI * -0.5)
  scene.add(MeshEast);
  planes.push(MeshEast)

  const MeshSouth = new THREE.Mesh(geo, mat);
  MeshSouth.position.set(0, 0, boxOffset)
  MeshSouth.rotateZ(Math.PI * -0.5)
  scene.add(MeshSouth);
  planes.push(MeshSouth)

  const MeshNorth = new THREE.Mesh(geo, mat);
  MeshNorth.position.set(0, 0, -boxOffset)
  MeshNorth.rotateZ(Math.PI * -0.5)
  scene.add(MeshNorth);
  planes.push(MeshNorth)

  for (const plane of planes) {
    plane.updateMatrixWorld();
  }
}

function addGUI() {
  stats = new Stats();
  document.body.appendChild(stats.dom);

  gui = new GUI();

  addCommonGUI(gui);
}

function registerObjects() {
  const numSpheres = 50;

  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
  sphereGeo.computeBoundingBox()

  for (let i = 0; i < numSpheres; i++) {
    const base = new THREE.Object3D();
    scene.add(base);

    const u = i / numSpheres;
    const light = new THREE.PointLight(0xffffff, 0.5, 5)
    light.color.setHSL(u, 1, .75)
    base.add(light)

    const sphereMat = new THREE.MeshBasicMaterial();
    sphereMat.color.setHSL(u, 1, .75);
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    base.add(sphereMesh);

    base.velocity = new THREE.Vector3(randFloat(-1, 1), randFloat(-1, 1), randFloat(-1, 1)).normalize();

    spheres.push(base)
  }
}

function detectCollisionCubes(object1, object2){
  let box1 = object1.geometry.boundingBox.clone();
  box1.applyMatrix4(object1.matrixWorld);

  let box2 = object2.geometry.boundingBox.clone();
  box2.applyMatrix4(object2.matrixWorld);

  return box1.intersectsBox(box2);
}


function updateSpheres(delta) {
  for (const sphere of spheres) {
    for (const plane of planes) {
      if (detectCollisionCubes(sphere.children[1], plane)) {
        const normal = new THREE.Vector3().copy(plane.position).multiplyScalar(-1).normalize();
        sphere.velocity.reflect(normal)
      }
    }

    const displacement = new THREE.Vector3().copy(sphere.velocity).multiplyScalar(delta * sphereSpeed);
    sphere.position.add(displacement);
  }
}

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 3;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  registerObjects();


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

  const delta = clock.getDelta();

  updateSpheres(delta);

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

export {init as balls}