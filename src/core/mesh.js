import { unit, rotation, toArray, translate, scale, multiple } from '../utils/Matrix'
import { numberMultiple, castTo } from '../utils/Vector'

import vertexShader from '../shaders/vertex.glsl'
import fragmentShader from '../shaders/fragment.glsl'

import MHighlight from '../materials/highlight'

export default class Mesh {
  constructor(data, options = {}) {
    this.vertex = data.vertex
    this.normal = data.normal
    this.texCoord = data.texCoord
    this.translation = unit(4)
    this.rotation = unit(4)
    this.scaling = unit(4)
    this.transform = options.transform || unit(4)
    this._time = 0
    if(typeof options.update === 'function') {
      this.update = options.update.bind(this)
    }
    this.material = null
  }

  _update() {
    this._time++
    this.update && this.update()
    this._render()
  }

  translate(vector) {
    this.translation = translate(vector)
    this.updateTransform()
  }

  rotate(angle, vector) {
    this.rotation = rotation(angle, vector)
    this.updateTransform()
  }

  scale(vector) {
    this.scaling = scale(vector)
    this.updateTransform()
  }

  updateTransform() {
    this.transform = multiple(multiple(this.rotation, this.scaling), this.translation)
  }

  setMaterial(mat) {
    this.material = mat
    mat.mesh = this
    mat.init()
  }

  setHighlight() {
    this.highlightMat = new MHighlight({
      color: [1, 1, 1]
    })
    this.highlightMat.mesh = this
    this.highlightMat.init()
  }

  renderHighlight() {
    gl.stencilFunc(gl.NOTEQUAL, 1, 0xFF)
    gl.stencilMask(0)

    const originScale = this.scaling
    this.scaling = multiple(this.scaling, scale([1.05, 1.05, 1.05]))
    this.updateTransform()
    this.highlightMat.mesh = this
    this.highlightMat.render()
    this.scaling = originScale
    this.updateTransform()

    gl.stencilMask(0xFF)
    gl.stencilFunc(gl.ALWAYS, 0, 0xFF)
  }

  _render() {
    if(this.material) {
      if(this.highlightMat) {
        gl.stencilFunc(gl.ALWAYS, 1, 0xFF)
        gl.stencilMask(0xFF)
      } else {
        gl.stencilMask(0)
      }
      this.material.mesh = this
      this.material.render()
    }
    if(this.highlightMat) {
      this.renderHighlight()
    }
  }
}