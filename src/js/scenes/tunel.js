import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {GUI} from "dat.gui";
import '../proto.js';
import {addCommonGUI} from "../common";
import SimplexNoise from 'simplex-noise';

const simplex = new SimplexNoise(Math.random());

let scene, camera, renderer, controls, stats, gui, light, geometry, material, tube;

let linesGeometries;

let regimes = ['mesh', 'decals', 'lines']

var points = [
  [68.5,185.5, 65.4],
  [1,262.5, 12.2],
  [270.9,281.9, 14.5],
  [345.5,212.8, 255.1],
  [178,155.7, 134.2],
  [240.3,72.3, 55.1],
  [153.4,0.6, 52.2],
  [52.6,53.3, 55.3,],
  [68.5,185.5, 65.4]
];

let time = 0;

let path = new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)))

let settings = {
  speed: 0.0003,
  useLight: true,
  tubularSegments: 300,
  meshRadius: 3,
  radialSegments: 24,
  useWire: true,
  tubeColor: {r: 255, g: 0, b: 0},
  segments: 500,
  circlesDetail: 10,
  decalsRadius: 3,
  regime: 'lines',
  linesDetails: 1000,
  linesCirculars: 12,
  linesRadius: 8
}

function addGUI() {
  stats = new Stats();
  document.body.appendChild(stats.dom);

  gui = new GUI();

  addCommonGUI(gui);

  gui.add(settings, 'regime', regimes)
    .onChange(() => compute())

  const cameraFolder = gui.addFolder("camera");
  cameraFolder.add(camera, 'fov', 60, 120, 1)
    .onChange(() => camera.updateProjectionMatrix());
  cameraFolder.add(settings, 'speed', 0.0001, 0.001, 0.0001);

  const settingsFolder = gui.addFolder("mesh");
  settingsFolder.add(settings, 'useLight')
    .onChange(() => compute())
  settingsFolder.add(settings, 'useWire')
    .onChange(() => compute())
  settingsFolder.add(settings, 'tubularSegments', 4, 500, 1)
    .onChange(() => compute())
  settingsFolder.add(settings, 'radialSegments', 3, 36, 1)
    .onChange(() => compute())
  settingsFolder.add(settings, 'meshRadius', 0.1, 10, 0.1)
    .onChange(() => compute())
  settingsFolder.addColor(settings, 'tubeColor')
    .onChange(() => compute())

  const decalsFolder = gui.addFolder("decals");
  decalsFolder.add(settings, 'segments', 100, 1000, 1)
    .onChange(() => compute())
  decalsFolder.add(settings, 'circlesDetail', 3, 36, 1)
    .onChange(() => compute())
  decalsFolder.add(settings, 'decalsRadius', 0.1, 10, 0.1)
    .onChange(() => compute())

  const linesFolder = gui.addFolder("lines")
  linesFolder.add(settings, 'linesDetails', 500, 5000, 1)
    .onChange(() => compute())
  linesFolder.add(settings, 'linesCirculars', 3, 36, 1)
    .onChange(() => compute())
  linesFolder.add(settings, 'linesRadius', 2, 50, 0.1)
    .onChange(() => compute())
}

// recompute all instances
function compute() {
  // dispose all

  if (tube) {
    scene.remove(tube);
    tube = null;
  }
  if (geometry) {
    geometry.dispose();
    geometry = null;
  }
  if (material) {
    material = null;
  }
  if (light) {
    scene.remove(light)
    light.dispose()
    light = null
  }
  if (linesGeometries) {
    for (const lineGeo of linesGeometries) {
      lineGeo.dispose();
    }
    linesGeometries = null;
  }

  while(scene.children.length > 0){
    scene.remove(scene.children[0]);
  }

  if (settings.useLight) {
    light = new THREE.PointLight(0xffffff, 1, 50)

    scene.add(light)
  }

  let color = new THREE.Color(settings.tubeColor.r / 255, settings.tubeColor.g / 255, settings.tubeColor.b / 255)

  if (settings.regime == 'decals') {
    geometry = new THREE.BufferGeometry();

    let frames = path.computeFrenetFrames(settings.segments, true)

    let vertices = [];
    let colors = [];

    for (let i = 0; i < settings.segments; i++) {

      // Get the normal values of the segment from the Frenet frames
      const normal = frames.normals[i];
      // Get the binormal values of the segment from the Frenet frames
      const binormal = frames.binormals[i];

      // Calculate the index of the segment (from 0 to 1)
      const index = i / settings.segments;

      // Get the coordinates of the point in the center of the segment
      // We already used the function in the first part to move the camera along the path
      const p = path.getPointAt(index);

      // Loop for the amount of particles we want along each circle
      for (let j = 0; j < settings.circlesDetail; j++) {

        // Clone the point in the center of the circle
        const position = p.clone();

        // We need to position every point based on an angle from 0 to Pi*2
        // If you want only half a tube (like a water slide) you could calculate the angle from 0 to Pi.
        const angle = (j / settings.circlesDetail) * Math.PI * 2;

        // Calculate the sine of the angle
        const sin = Math.sin(angle);
        // Calculate the negative cosine of the angle
        const cos = -Math.cos(angle);

        // Calculate the normal of each point based on its angle and the normal and binormal of the segment
        const normalPoint = new THREE.Vector3(0,0,0);
        normalPoint.x = (cos * normal.x + sin * binormal.x);
        normalPoint.y = (cos * normal.y + sin * binormal.y);
        normalPoint.z = (cos * normal.z + sin * binormal.z);

        // Multiple the normal by the radius so that our tube is not a tube of 1 as radius
        normalPoint.multiplyScalar(settings.decalsRadius);

        // Add the normal values to the center of the circle
        position.add(normalPoint);

        // Push the vector into our geometry
        vertices.push(position.x, position.y, position.z);

        let color = new THREE.Color("hsl(" + (index * 360 * 4) + ", 100%, 50%)");

        colors.push(color.r, color.g, color.b)
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    material = new THREE.PointsMaterial({size: 0.5, sizeAttenuation: true, vertexColors: THREE.VertexColors})

    tube = new THREE.Points(geometry, material)
  } else if (settings.regime == 'lines') {
    let frames = path.computeFrenetFrames(settings.linesDetails, true)
    linesGeometries = [];

    for (let i = 0; i < settings.linesDetails; i++) {

      const normal = frames.normals[i];
      const binormal = frames.binormals[i];

      const index = i / settings.linesDetails;

      const p = path.getPointAt(index);

      let circle = new THREE.BufferGeometry();
      let circleVertices = []

      for (let j = 0; j < settings.linesCirculars; j++) {
        const position = p.clone();

        let angle = (j / settings.linesCirculars) * Math.PI * 2;
        angle += simplex.noise2D(index * 0.3, 0) * 30

        const sin = Math.sin(angle);
        const cos = -Math.cos(angle);

        const normalPoint = new THREE.Vector3(0,0,0);
        normalPoint.x = (cos * normal.x + sin * binormal.x);
        normalPoint.y = (cos * normal.y + sin * binormal.y);
        normalPoint.z = (cos * normal.z + sin * binormal.z);

        normalPoint.multiplyScalar(settings.linesRadius);

        position.add(normalPoint);

        circleVertices.push(position.x, position.y, position.z);
      }

      circleVertices.push(...circleVertices.slice(0, 3))
      circle.setAttribute('position', new THREE.Float32BufferAttribute(circleVertices, 3))

      let material = new THREE.LineBasicMaterial({
        color: new THREE.Color("hsl("+(simplex.noise2D(index * 10, 0)*60 + 300)+",50%,50%)")
      })
      let line = new THREE.Line(circle, material)
      linesGeometries.push(circle)

      scene.add(line)
    }
  } else if (settings.regime == 'mesh') {
    geometry = new THREE.TubeGeometry(path, settings.tubularSegments, settings.meshRadius, settings.radialSegments, true)

    if (!settings.useLight)
      material = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.BackSide, wireframe: settings.useWire})
    else
      material = new THREE.MeshLambertMaterial({
        color: color,
        side: THREE.BackSide, wireframe: settings.useWire})

    tube = new THREE.Mesh(geometry, material)
  }



  scene.add(tube)

}

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  scene.fog = new THREE.Fog(0x000000,100,200)

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  compute();

  addGUI();

  //resize
  window.addEventListener('resize', onResize, false);
  onResize();
  update();
}

function update() {
  requestAnimationFrame(update);

  time += settings.speed;

  let p1 = path.getPointAt(time%1)
  let p2 = path.getPointAt((time + 0.01)%1)

  camera.position.set(p1.x, p1.y, p1.z)
  camera.lookAt(p2)

  if (light)
    light.position.set(p1.x, p1.y, p1.z)

  renderer.render(scene, camera);
  stats.update();
}

function onResize() {
  let w = window.innerWidth;
  let h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  renderer.setPixelRatio(window.devicePixelRatio);
}

export {init as tunel}