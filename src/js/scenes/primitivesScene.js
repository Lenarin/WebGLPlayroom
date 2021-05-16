import {commonScene} from "./commonScene";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";



export class primitivesScene extends commonScene {
  gui; renderer; #ambientLight; #scene; #camera; #controls;

  #objectMap = {
    cube: undefined,
    sphere: undefined,
    cone: undefined,
    torus: undefined
  }

  #params = {
    currentObjectName: "cube",
    currentObject: undefined,
  }

  #addGUI(gui) {
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

  #registerObjects() {
    const material = new THREE.MeshPhongMaterial({ color: 0xafe32a });

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    this.#objectMap.cube = new THREE.Mesh(boxGeometry, material);

    const coneGeometry = new THREE.ConeGeometry(1, 2, 32, 3);
    this.#objectMap.cone = new THREE.Mesh(coneGeometry, material);

    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
    this.#objectMap.sphere = new THREE.Mesh(sphereGeometry, material);

    const torusGeometry = new THREE.TorusGeometry(1, 0.4, 32, 32);
    this.#objectMap.torus = new THREE.Mesh(torusGeometry, material);
  }

  #onResize() {

  }

  constructor(gui, renderer) {
    super(gui, renderer);
    this.gui = gui;
    this.renderer = renderer;

    this.#scene = new THREE.Scene();
    this.#camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.#camera.position.z = 3;

    this.#registerObjects();

    this.#params.currentObject = this.#objectMap.cube ;
    scene.add(this.#params.currentObject);

    this.#directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    this.#directionalLight.position.set(-1, 2, 4);
    scene.add(this.#directionalLight);

    this.#ambientLight = new THREE.AmbientLight( 0x404040, 0.2);
    scene.add(this.#ambientLight);

    this.#controls = new OrbitControls(camera, renderer.domElement);

    this.#addGUI(gui);

    window.addEventListener('resize', this.#onResize, false);
    this.#onResize();
    this.onUpdate();
  }

  onUpdate() {
    this.#params.currentObject.rotation.x += 0.01;
    this.#params.currentObject.rotation.y += 0.01;
    renderer.render(scene, camera);
    this.#controls.update();
  }
}