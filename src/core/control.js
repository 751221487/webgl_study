class Control {
  constructor() {
    this.keyMap = {}
    this.mouseMove = {
      x: 0,
      y: 0
    }
    this.bindEvent()
  }

  bindEvent() {
    window.document.addEventListener('keydown', (e) => {
      this.keyMap[e.keyCode] = true
    })
    window.document.addEventListener('keyup', (e) => {
      this.keyMap[e.keyCode] = false
    })

    window.document.addEventListener('mousedown', (e) => {
      this.keyMap['lm'] = true
    })
    window.document.addEventListener('mouseup', (e) => {
      this.keyMap['lm'] = false
    })
    window.document.addEventListener('mousemove', e => {
      this.mouseMove.x = e.movementX
      this.mouseMove.y = e.movementY
    })
  }

  getKey(k) {
    return this.keyMap[k]
  }

  getMouse(axias) {
    return this.mouseMove[axias]
  }

}

export default new Control()