'use strict'

import { Group } from 'three/src/objects/Group'
import { CanvasTexture } from 'three/src/textures/CanvasTexture'
import { LinearFilter } from 'three/src/constants'
import { Vector2 } from 'three/src/math/Vector2'
import { Vector3 } from 'three/src/math/Vector3'
import { Raycaster } from 'three/src/core/Raycaster'

import Pointer from 'Utils/Pointer'
import EMath from 'Utils/EMath'

import Config from '../Config'
import Type from '../Type'

export default class Typography extends Group {
  constructor() {
    super()

    this.numStacks = 10
    this.firstStacks = []
    this.create()

    this.numChildren = this.children.length

    this.rotation.x = -Math.PI * 0.32
    this.rotation.z = Math.PI * 0.1
    this.position.y = -0.045

    this.raycaster = new Raycaster()
    this.pointer = new Vector2()
    this.prevX = 0
  }

  create() {
    const range = 1.5
    const div = 10
    const size = range / div
    let gIndex = 0

    //* 10x10のグリッド上に配置する
    for (let xi = 0; xi < div; xi++) {
      for (let yi = 0; yi < div; yi++) {
        const x = -range / 2 + xi * size + size / 2
        const y = -range / 2 + yi * size + size / 2

        const texture = this.createTexture({ size: 128 })

        //* numStacks分上に積み上げる
        for (let i = 0; i < this.numStacks; i++) {
          const type = new Type({
            size,
            texture,
            position: new Vector3(x, y, i * 0.01),
            index: i,
            gIndex: gIndex++,
          })
          this.add(type)

          //* 最初のスタックのみ配列に保存
          if (i === 0) {
            this.firstStacks.push(type)
          }
        }
      }
    }
  }

  createTexture({ size }) {
    const canvas = document.createElement('canvas')
    const width = size * Config.dpr
    const height = size * Config.dpr
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')

    // ctx.lineWidth = 2
    // ctx.strokeStyle = '#fff'
    // ctx.strokeRect(0, 0, width, height)

    const fontSize = size * Config.dpr
    const char = String.fromCharCode(65 + EMath.randomInt(0, 26))

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#fff'
    ctx.font = `${fontSize}px 'Millimetre-Bold'`
    ctx.fillText(char, width / 2, height / 2)

    const texture = new CanvasTexture(canvas)
    texture.needsUpdate = false
    texture.minFilter = LinearFilter
    texture.magFilter = LinearFilter
    texture.generateMipmaps = false

    return texture
  }

  update({ time, deltaTime, camera }) {
    this.pointer.x = -1 + (Pointer.x / window.innerWidth) * 2
    this.pointer.y = 1 - (Pointer.y / window.innerHeight) * 2

    //* firstStacksの中から、ポインターと交差したオブジェクトを探す
    this.raycaster.setFromCamera(this.pointer, camera)
    const intersects = this.raycaster.intersectObjects(this.firstStacks)

    for (let i = 0; i < intersects.length; i++) {
      const gIndex = intersects[i].object.gIndex
      //* 交差しているオブジェクトがアニメーション中ならスキップ
      if (this.children[gIndex].isAnimating) continue

      //* 積み上がっている全オブジェクトをアニメーション
      for (let j = gIndex; j < gIndex + this.numStacks; j++) {
        this.children[j].animate(Math.sign(Pointer.x - this.prevX))
      }
    }

    //* オブジェクトを更新
    for (let i = 0; i < this.numChildren; i++) {
      this.children[i].update(time)
    }

    this.prevX = Pointer.x
  }
}
