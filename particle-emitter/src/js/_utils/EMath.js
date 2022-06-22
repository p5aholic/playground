'use strict'

export default class EMath {
  static random(a, b) {
    if (typeof a === 'undefined') {
      return Math.random()
    } else if (typeof b === 'undefined') {
      return Math.random() * a
    } else {
      return a + Math.random() * (b - a)
    }
  }

  static randomInt(a, b) {
    return Math.floor(EMath.random(a, b))
  }

  static constrain(value, min, max) {
    return Math.max(Math.min(value, max), min)
  }

  static map(value, start1, stop1, start2, stop2) {
    return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2
  }

  static radians(degree) {
    return degree * ((2 * Math.PI) / 360)
  }

  static magnitude(x, y) {
    return EMath.dist(0, 0, x, y)
  }

  static dist(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
  }

  static lerp(value1, value2, alpha) {
    return value1 + (value2 - value1) * alpha
  }
}
