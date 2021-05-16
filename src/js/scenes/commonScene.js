const commonGUIScenes = ["solar", "primitives"]

const param = {
  current: window.location.pathname.slice(1)
}

function addCommonGUI(gui) {
  const scene = gui.addFolder("scene");
  scene.add(param, 'current', commonGUIScenes)
    .onChange(val => window.location.pathname = `/${val}`)
}

export class commonScene {
  constructor(gui, renderer) {
  }

  onUpdate();
}