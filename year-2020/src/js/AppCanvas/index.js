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
    const kaeruFontFace = new FontFace('KaeruKaeru', 'url(./fonts/kaerukaeru-Regular.woff2)')
    await kaeruFontFace.load()
    document.fonts.add(kaeruFontFace)

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

    this.typo.update({ time, deltaTime })
    this.renderer.render(this.scene, this.camera)
  }
}
