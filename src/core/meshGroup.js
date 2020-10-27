import { toArray } from '../utils/Matrix'
export default class MeshGroup {
  
  constructor(meshs) {
    this.meshs = meshs
  }

  _update() {
    this._time++
    this.update && this.update()
    this._render()
  }

  setMaterial(mat) {
    let instanceMat = []
    for(var i = 0; i < this.meshs.length; i++) {
      instanceMat = instanceMat.concat(toArray(this.meshs[i].transform))
    }
    this.meshs[0].setMaterial(mat, {
      instanceMat,
    })
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
     let mesh = this.meshs[0]

     if(mesh.material) {
      if(mesh.highlightMat) {
        gl.stencilFunc(gl.ALWAYS, 1, 0xFF)
        gl.stencilMask(0xFF)
      } else {
        gl.stencilMask(0)
      }
      mesh.material.mesh = mesh
      mesh.material.render({count: this.meshs.length})
    }
    if(mesh.highlightMat) {
      mesh.renderHighlight({count: this.meshs.length})
    }
  }

}