import { unit, rotation, toArray, translate, scale, multiple } from '../utils/Matrix'
import { numberMultiple, castTo } from '../utils/Vector'

import vertexShader from '../shaders/vertex.glsl'
import fragmentShader from '../shaders/fragment.glsl'


export default class Mesh {
  constructor(data, options = {}) {
    this.vertex = data.vertex
    this.normal = data.normal
    this.texCoord = data.texCoord
    this.translation = unit(4)
    this.rotation = unit(4)
    this.scaling = unit(4)
    this.transform = options.transform || unit(4)
    if(typeof options.update === 'function') {
      this.update = options.update.bind(this)
    }
    this.material = null
  }

  _update() {
    this.update && this.update()
    this._render()
  }

  translate(vector) {
    this.translation = translate(vector)
    this.updateTranslate()
  }

  rotate(angle, vector) {
    this.rotation = rotation(angle, vector)
    this.updateTranslate()
  }

  scale(vector) {
    this.scaling = scale(vector)
    this.updateTranslate()
  }

  updateTranslate() {
    this.transform = multiple(multiple(this.rotation, this.scaling), this.translation)
  }

  setMaterial(mat) {
    this.material = mat
    mat.mesh = this
    mat.init()
  }

  _render() {
    if(this.material) {
      this.material.mesh = this
      this.material.render()
    }
  }

}