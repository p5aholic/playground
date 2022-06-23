'use strict'

import AppCanvas from './AppCanvas'

document.addEventListener('DOMContentLoaded', () => {
  new AppCanvas({
    view: document.querySelector('#CanvasContainer canvas'),
    useContextAlpha: false,
    backgroundColor: 0x030e1a,
    resolution: Math.min(window.devicePixelRatio, 2),
    resizeTo: window,
  })
})
