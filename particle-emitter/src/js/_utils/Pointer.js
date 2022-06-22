'use strict'

let instance = null

export default class Pointer {
  constructor() {
    if (instance) return instance

    this.px = 0
    this.py = 0

    instance = this
    this.init()
  }

  static getInstance() {
    if (!instance) {
      instance = new Pointer()
    }
    return instance
  }

  static get x() {
    return Pointer.getInstance().px
  }

  static get y() {
    return Pointer.getInstance().py
  }

  init() {
    document.addEventListener('pointermove', this.onPointerMove.bind(this))
  }

  onPointerMove(e) {
    this.px = e.pageX
    this.py = e.pageY
  }
}
