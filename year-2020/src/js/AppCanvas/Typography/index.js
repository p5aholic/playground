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

export default class Typography {
  constructor() {
    const geometry = new PlaneGeometry(2, 2)

    // canvas 2dを使い動的にテクスチャを作成
    const texture = this.createTexture({
      size: 1024,
      text: '2020',
      fontFamily: 'KaeruKaeru',
    })

    const material = new RawShaderMaterial({
      uniforms: {
        texture: { value: texture },
        time: { value: 0 },
        pointer: { value: new Vector2(0, 0) },
      },
      vertexShader,
      fragmentShader,
      transparent: false,
    })

    this.mesh = new Mesh(geometry, material)

    // ポインターの動きをなめらかにするためのTweenを作成
    this.tween = new Tween2({ x: 0, y: 0 }, 10)
  }

  createTexture({ size, text, fontFamily }) {
    // canvas要素を作成し、テクスチャに必要なサイズを設定
    const canvas = document.createElement('canvas')
    const width = size * Config.dpr
    const height = size * Config.dpr
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')

    // 背景色を設定
    ctx.fillStyle = 'hsl(180 10% 80% / 1)'
    ctx.fillRect(0, 0, width, height)

    // 中央に文字を描画
    const fontSize = 0.25 * size * Config.dpr
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'hsl(345 80% 50% / 1)'
    ctx.font = `${fontSize}px '${fontFamily}'`
    ctx.fillText(text, width / 2, height / 2)

    // canvasからテクスチャを作成
    const texture = new CanvasTexture(canvas)
    texture.needsUpdate = false
    texture.minFilter = LinearFilter
    texture.magFilter = LinearFilter
    texture.generateMipmaps = false

    // 作成したテクスチャを返す
    return texture
  }

  update({ time, deltaTime }) {
    // Pointerの座標をthree.jsのシーン用に変換
    const px = -Config.sceneWidth / 2 + (Pointer.x / window.innerWidth) * Config.sceneWidth
    const py = Config.sceneHeight / 2 - (Pointer.y / window.innerHeight) * Config.sceneHeight
    this.tween.update({ x: -px, y: -py }, deltaTime)

    this.mesh.material.uniforms.time.value = time
    this.mesh.material.uniforms.pointer.value.x = this.tween.position.x
    this.mesh.material.uniforms.pointer.value.y = this.tween.position.y
  }
}
