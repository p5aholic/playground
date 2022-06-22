'use strict'

import AppCanvas from './AppCanvas'

document.addEventListener('DOMContentLoaded', () => {
  const $canvasContainer = document.getElementById('CanvasContainer')

  new AppCanvas({
    view: $canvasContainer.querySelector('canvas'),
    useContextAlpha: false,
    backgroundColor: 0x030e1a,
    resolution: Math.min(window.devicePixelRatio, 2),
    resizeTo: window,
  })
})
