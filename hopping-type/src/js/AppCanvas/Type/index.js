'use strict'

import { Mesh } from 'three/src/objects/Mesh'
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry'
import { RawShaderMaterial } from 'three/src/materials/RawShaderMaterial'
import { Color } from 'three/src/math/Color'
import { DoubleSide } from 'three/src/constants'
import { gsap } from 'gsap'
import sleep from 'Utils/sleep'

import vertexShader from './shader/vert.glsl'
import fragmentShader from './shader/frag.glsl'

export default class Type extends Mesh {
  constructor({ position, size, texture, index, gIndex }) {
    super()

    this.index = index
    this.gIndex = gIndex

    this.geometry = new PlaneGeometry(size, size)

    //* 背景色から、上に行くほど赤色に遷移する色をつくる
    const bgColor = new Color('hsl(210, 100%, 10%)')
    const matColor = new Color('hsl(345, 100%, 50%)')
    bgColor.lerp(matColor, (this.index + 1) / 10)

    this.material = new RawShaderMaterial({
      uniforms: {
        texture: { value: texture },
        tint: { value: bgColor },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      side: DoubleSide,
    })

    this.position.copy(position)
    this.initialZ = this.position.z

    this.hopTween = {
      height: 0,
      rot: 0,
    }
    this.rotDir = 1
    this.targetRot = 0
    this.isAnimating = false
  }

  async animate(dir) {
    this.isAnimating = true

    gsap.fromTo(
      this.hopTween,
      { height: 0 },
      {
        height: 1,
        duration: 0.1 + this.index * 0.05,
        ease: 'power3.out',
        yoyo: true,
        repeat: 1,
      },
    )

    gsap.fromTo(
      this.hopTween,
      { rot: 0 },
      {
        rot: 1,
        duration: 0.1 + this.index * 0.05,
        ease: 'power3.out',
      },
    )

    this.rotDir = dir
    this.targetRot = this.rotDir * Math.PI * 2.0

    await sleep((0.1 + 9 * 0.05) * 2)
    this.isAnimating = false
  }

  update() {
    // const height = this.hopTween.height * this.index * 0.05
    const height = Math.pow(this.hopTween.height * this.index * 0.05, 2.0)
    this.position.z = this.initialZ + height

    const rot = this.hopTween.rot * this.targetRot
    this.rotation.y = rot
  }
}
