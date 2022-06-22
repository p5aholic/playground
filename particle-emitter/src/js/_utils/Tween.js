'use strict'

// Exponential Tween For Vector1
class Tween {
  constructor(x, omega) {
    this.x = x
    this.velocity = 0
    this.omega = omega
  }

  lerp(value1, value2, alpha) {
    return value1 + (value2 - value1) * alpha
  }

  update(target, delta) {
    const alpha = Math.exp(-this.omega * delta)
    const newX = this.lerp(target, this.x, alpha)

    this.velocity = newX - this.x
    this.x = newX
  }

  reset() {
    this.x = 0
    this.velocity = 0
  }
}

// Exponential Tween For Vector2
class Tween2 {
  constructor({ x, y }, omega) {
    this.position = { x, y }
    this.velocity = { x: 0, y: 0 }
    this.omega = omega
    this.direction = 0
  }

  lerp(value1, value2, alpha) {
    return value1 + (value2 - value1) * alpha
  }

  update(target, delta) {
    const alpha = Math.exp(-this.omega * delta)
    const newX = this.lerp(target.x, this.position.x, alpha)
    const newY = this.lerp(target.y, this.position.y, alpha)

    this.velocity.x = newX - this.position.x
    this.velocity.y = newY - this.position.y
    this.position.x = newX
    this.position.y = newY
  }

  calcDirection(target) {
    this.direction = Math.atan2(this.position.y - target.y, this.position.x - target.x)
  }

  reset() {
    this.position.x = 0
    this.position.y = 0
    this.velocity.x = 0
    this.velocity.y = 0
    this.direction = 0
  }

  set x(value) {
    this.position.x = value
  }

  set y(value) {
    this.position.y = value
  }

  get x() {
    return this.position.x
  }

  get y() {
    return this.position.y
  }
}

export { Tween, Tween2 }
