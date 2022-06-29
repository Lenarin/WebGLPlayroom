const commonGUIScenes = ["solar", "primitives", "balls", "shaders", "tunel"]

const param = {
  current: window.location.pathname.substring(1)
}

export function addCommonGUI(gui) {
  const scene = gui.addFolder("scene");
  scene.add(param, 'current', commonGUIScenes)
    .onChange(val => {
      const target = window.location.origin + `/${val}`
      window.location.replace(target)
    })
}