const globalOld = {}

export function setGlobal (key, value) {
  globalOld[key] = global[key]
  global[key] = value
}

export function revertGlobal () {
  for (const key of Object.keys(globalOld)) {
    global[key] = globalOld[key]
  }
}
