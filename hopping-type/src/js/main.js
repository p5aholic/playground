'use strict'

import AppCanvas from './AppCanvas'

let app = null
let lastUpdateTime = 0

// リサイズ管理用オブジェクト
const resize = {
  prevSize: { w: 0, h: 0 },
  checkTime: 0,
  interval: 500 * 0.001,
}

document.addEventListener('DOMContentLoaded', () => {
  app = new AppCanvas()
  lastUpdateTime = performance.now() * 0.001
  update()
})

function update() {
  requestAnimationFrame(update)

  const time = performance.now() * 0.001
  // リサイズすべきかチェック
  if (checkResize(time)) {
    app.resize()
  }

  const deltaTime = time - lastUpdateTime
  lastUpdateTime = time

  // appを更新
  app.update({ time, deltaTime })
}

function checkResize(time) {
  // 設定したinterval秒が経過している場合のみ処理を実行
  if (time - resize.checkTime < resize.interval) return false
  resize.checkTime = time

  if (window.innerWidth !== resize.prevSize.w || window.innerHeight !== resize.prevSize.h) {
    resize.prevSize.w = window.innerWidth
    resize.prevSize.h = window.innerHeight
    return true
  }

  return false
}
