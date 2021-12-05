const commonGUIScenes = ["solar", "primitives", "balls", "shaders", "tunel"]

const param = {
  current: window.location.pathname.slice(1)
}

export function addCommonGUI(gui) {
  const scene = gui.addFolder("scene");
  scene.add(param, 'current', commonGUIScenes)
    .onChange(val => window.location.pathname = `/${val}`)
}