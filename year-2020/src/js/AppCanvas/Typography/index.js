'use strict'

import { Mesh } from 'three/src/objects/Mesh'
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry'
import { RawShaderMaterial } from 'three/src/materials/RawShaderMaterial'
import { CanvasTexture } from 'three/src/textures/CanvasTexture'
import { LinearFilter } from 'three/src/constants'
import { Vector2 } from 'three/src/math/Vector2'

import Pointer from 'Util/Pointer'
import { Tween2 } from 'Util/Tween'

import Config from '../Config'
import vertexShader from './shader/vert.glsl'
import fragmentShader from './shader/frag.glsl'

export default class Typography extends Mesh {
  constructor() {
    super()

    this.geometry = new PlaneGeometry(2, 2)

    const texture = this.createTexture({
      size: 1024,
      text: '2020',
      fontFamily: 'KaeruKaeru',
    })

    this.material = new RawShaderMaterial({
      uniforms: {
        texture: { value: texture },
        time: { value: 0 },
        seed: { value: Math.random() },
        mouse: { value: new Vector2(0, 0) },
      },
      vertexShader,
      fragmentShader,
      transparent: false,
      depthTest: false,
      depthWrite: false,
    })

    this.tween = new Tween2({ x: 0, y: 0 }, 30)
  }

  createTexture({ size, text, fontFamily }) {
    const canvas = document.createElement('canvas')
    const width = size * Config.dpr
    const height = size * Config.dpr
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')

    ctx.fillStyle = 'hsl(180 10% 80% / 1)'
    ctx.fillRect(0, 0, width, height)

    const fontSize = 0.25 * size * Config.dpr

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'hsl(345 80% 50% / 1)'
    ctx.font = `${fontSize}px '${fontFamily}'`
    ctx.fillText(text, width / 2, height / 2)

    const texture = new CanvasTexture(canvas)
    texture.needsUpdate = false
    texture.minFilter = LinearFilter
    texture.magFilter = LinearFilter
    texture.generateMipmaps = false

    return texture
  }

  update(time) {
    const mx = -Config.sceneWidth / 2 + (Pointer.x / window.innerWidth) * Config.sceneWidth
    const my = Config.sceneHeight / 2 - (Pointer.y / window.innerHeight) * Config.sceneHeight
    this.tween.step({ x: -mx, y: -my })

    this.material.uniforms.time.value = time
    this.material.uniforms.mouse.value.x = this.tween.position.x
    this.material.uniforms.mouse.value.y = this.tween.position.y
  }
}
