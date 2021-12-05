const commonGUIScenes = ["solar", "primitives", "balls", "shaders", "tunel"]

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const scene = urlParams.get('scene')

const param = {
  current: scene
}

export function addCommonGUI(gui) {
  const scene = gui.addFolder("scene");
  scene.add(param, 'current', commonGUIScenes)
    .onChange(val => {
      const target = window.location.origin + window.location.pathname + `?scene=${val}`
      window.location.replace(target)
    })
}