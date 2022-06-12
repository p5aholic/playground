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
    // フォントをロード
    const kaeruFontFace = new FontFace('KaeruKaeru', 'url(./fonts/kaerukaeru-Regular.woff2)')
    await kaeruFontFace.load()
    document.fonts.add(kaeruFontFace)

    // Meshを作成してシーンに追加
    this.typo = new Typography()
    this.scene.add(this.typo.mesh)

    // リサイズをしておいて準備完了
    this.resize()
    this.isReady = true
  }

  resize() {
    this.setConfig()
    this.resizeScene()
  }

  update({ time, deltaTime }) {
    if (!this.isReady) return

    // MeshとRendererを更新
    this.typo.update({ time, deltaTime })
    this.renderer.render(this.scene, this.camera)
  }
}
