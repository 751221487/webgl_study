import { unit, rotation, toArray, translate, scale, multiple } from '../utils/Matrix'
import { numberMultiple, castTo } from '../utils/Vector'

import vertexShader from '../shaders/vertex.glsl'
import fragmentShader from '../shaders/fragment.glsl'


export default class Mesh {
  constructor(data, options = {}) {
    this.vertex = data.vertex
    this.normal = data.normal
    this.texCoord = data.texCoord
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
    this.transform = multiple(this.transform, translate(vector))
  }

  rotate(angle, vector) {
    this.transform = multiple(this.transform, rotation(angle, vector))
  }

  scale(vector) {
    this.transform = multiple(this.transform, scale(vector))
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