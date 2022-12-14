'use strict'

import { Scene } from 'three/src/scenes/Scene'
import { OrthographicCamera } from 'three/src/cameras/OrthographicCamera'
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer'
import { Color } from 'three/src/math/Color'

import Config from './Config'

export default class BaseCanvas {
  constructor() {
    this.container = document.getElementById('CanvasContainer')
    this.setConfig()

    this.scene = new Scene()

    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 10000)
    this.camera.position.set(0, 0, 10)

    this.renderer = new WebGLRenderer({
      canvas: this.container.querySelector('canvas'),
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
    })

    this.renderer.setClearColor(new Color('hsl(210, 100%, 10%)'))
    this.renderer.setSize(Config.width, Config.height)
    this.renderer.setPixelRatio(Config.dpr)
  }

  setConfig() {
    const { width, height } = this.container.getBoundingClientRect()

    Config.dpr = Math.min(window.devicePixelRatio, 2)
    Config.width = width
    Config.height = height
    Config.halfWidth = Config.width / 2
    Config.halfHeight = Config.height / 2
    Config.aspectRatio = Config.width / Config.height
  }

  resizeScene() {
    if (window.innerWidth >= window.innerHeight) {
      Config.sceneWidth = 2
      Config.sceneHeight = 2 / Config.aspectRatio
    } else {
      Config.sceneWidth = 2 * Config.aspectRatio
      Config.sceneHeight = 2
    }

    this.camera.left = -Config.sceneWidth * 0.5
    this.camera.right = Config.sceneWidth * 0.5
    this.camera.top = Config.sceneHeight * 0.5
    this.camera.bottom = -Config.sceneHeight * 0.5
    this.camera.aspect = Config.aspectRatio
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(Config.width, Config.height)
  }
}
