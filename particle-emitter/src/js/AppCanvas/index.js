'use strict'

import * as PIXI from 'pixi.js'
import '@pixi/math-extras'

import Pointer from 'Utils/Pointer'
import EMath from 'Utils/EMath'
import { Tween2 } from 'Utils/Tween'

export default class AppCanvas extends PIXI.Application {
  constructor(options) {
    super(options)

    // Texture
    const $canvas = document.createElement('canvas')
    const texSize = 64
    $canvas.width = texSize
    $canvas.height = texSize

    const ctx = $canvas.getContext('2d')
    ctx.clearRect(0, 0, texSize, texSize)
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(texSize / 2, texSize / 2, texSize / 2, 0, Math.PI * 2.0)
    ctx.fill()

    // Ball
    this.ball = PIXI.Sprite.from($canvas)
    this.ball.width = 50
    this.ball.height = 50
    this.ball.anchor.set(0.5)
    this.ball.velocity = new PIXI.Point(0, 0)
    this.ball.prevPosition = new PIXI.Point(0, 0)
    this.stage.addChild(this.ball)

    // Pointer
    this.pointer = new PIXI.Point(Pointer.x, Pointer.y)

    // Particles
    this.numParticles = 5000
    this.emitCount = 0
    this.particles = new PIXI.ParticleContainer(this.numParticles, {
      scale: true,
      position: true,
      alpha: true,
    })
    this.particles.blendMode = PIXI.BLEND_MODES.ADD
    this.stage.addChild(this.particles)

    // Color Pallette
    const paletts = [0xe65800, 0xe6d700, 0x17e600, 0x00e6d3, 0x0051e6, 0xe6004d]

    for (let i = 0; i < this.numParticles; i++) {
      const particle = PIXI.Sprite.from($canvas)
      particle.width = 10
      particle.height = 10

      // Pick a randome color in pallets
      const pi = Math.floor(Math.random() * paletts.length)
      particle.tint = paletts[pi]

      particle.anchor.set(0.5)
      particle.x = Math.random() * this.screen.width
      particle.y = Math.random() * this.screen.height
      particle.alpha = 0
      particle.target = { x: 0, y: 0 }
      particle.tween = new Tween2({ x: 0, y: 0 }, 1)
      particle.seed = Math.random()

      this.particles.addChild(particle)
    }

    this.ticker.add(this.update.bind(this))
  }

  calcBallPosition(timeScale) {
    const K = 0.1 // Spring Constant
    const M = 1 // Ball Mass
    const D = 0.8 // Damping Coefficient

    //* Damped Oscillation
    //* M x A = F
    //* M x A = -K x X
    //* A = -(K x X) / M

    this.pointer.set(Pointer.x, Pointer.y)

    //* Calculate Acceleration
    const X = this.ball.position.subtract(this.pointer)
    const A = X.multiplyScalar(-K * (1 / M))

    this.ball.prevPosition.x = this.ball.x
    this.ball.prevPosition.y = this.ball.y

    //* V(t+1) = V(t) + delta * A
    //* X(t+1) = X(t) + delta * V
    this.ball.velocity = this.ball.velocity.add(A.multiplyScalar(timeScale))
    this.ball.position = this.ball.position.add(this.ball.velocity.multiplyScalar(timeScale))
    this.ball.velocity = this.ball.velocity.multiplyScalar(Math.pow(D, timeScale))
  }

  update() {
    const time = performance.now() * 0.001
    const timeScale = this.ticker.deltaTime // ex 1, 0.5
    const deltaTime = this.ticker.deltaMS * 0.001 // ex 0.008333

    // Update Ball Position
    this.calcBallPosition(timeScale)

    const ballSpeed = EMath.constrain(this.ball.velocity.magnitude(), 0, 100)
    const direction = Math.atan2(this.ball.y - Pointer.y, this.ball.x - Pointer.x)

    // Number of particles emitted per frame
    const emit = Math.min(Math.floor(ballSpeed * 0.2), this.numParticles * 0.1)
    for (let i = 0; i < emit; i++) {
      const p = this.particles.children[this.emitCount]
      const rAngle = Math.random() * Math.PI * 0.25
      const rLength = 0.2 + 0.8 * Math.random()
      const emitX = EMath.lerp(this.ball.prevPosition.x, this.ball.x, i / emit)
      const emitY = EMath.lerp(this.ball.prevPosition.y, this.ball.y, i / emit)
      p.x = emitX
      p.y = emitY
      p.tween.x = emitX
      p.tween.y = emitY
      p.target.x = emitX + 10 * ballSpeed * rLength * Math.cos(direction + rAngle)
      p.target.y = emitY + 10 * ballSpeed * rLength * Math.sin(direction + rAngle)
      p.alpha = 1
      p.direction = direction

      this.emitCount = ++this.emitCount % this.numParticles
    }

    // Update Particles
    for (let i = 0; i < this.numParticles; i++) {
      const p = this.particles.children[i]
      p.tween.update(p.target, deltaTime)

      const speed = EMath.magnitude(p.tween.velocity.x, p.tween.velocity.y)
      const angle = p.seed * Math.PI * 2.0 + time
      p.x = p.tween.x + (30.0 / speed) * Math.cos(angle)
      p.y = p.tween.y + (30.0 / speed) * Math.sin(angle)

      p.alpha = speed
      p.scale.set(speed * 0.1)
    }
  }
}
