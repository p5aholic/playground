'use strict'

import BaseCanvas from './BaseCanvas'
import Typography from './Typography'

export default class AppCanvas extends BaseCanvas {
  constructor() {
    super()

    this.isReady = false
    this.init()
  }

  async init() {
    const fontFace = new FontFace('Millimetre-Bold', 'url(./fonts/Millimetre-Bold.woff2)')
    await fontFace.load()
    document.fonts.add(fontFace)

    this.typo = new Typography()
    this.scene.add(this.typo)

    this.resize()
    this.isReady = true
  }

  resize() {
    this.setConfig()
    this.resizeScene()
  }

  update({ time, deltaTime }) {
    if (!this.isReady) return

    this.typo.update({ time, deltaTime, camera: this.camera })
    this.renderer.render(this.scene, this.camera)
  }
}
