'use strict'

import AppCanvas from './AppCanvas'

let app = null
let lastUpdateTime = performance.now()

const resize = {
  prevSize: { w: 0, h: 0 },
  checkTime: 0,
  interval: 500 * 0.001,
}

document.addEventListener('DOMContentLoaded', () => {
  app = new AppCanvas()
  update()
})

function update() {
  requestAnimationFrame(update)

  const time = performance.now() * 0.001
  if (checkResize(time)) {
    app.resize()
  }

  const deltaTime = time - lastUpdateTime
  lastUpdateTime = time

  app.update({ time, deltaTime })
}

function checkResize(time) {
  if (time - resize.checkTime < resize.interval) return false
  resize.checkTime = time

  if (window.innerWidth !== resize.prevSize.w || window.innerHeight !== resize.prevSize.h) {
    resize.prevSize.w = window.innerWidth
    resize.prevSize.h = window.innerHeight
    return true
  }

  return false
}
