import Material from '../core/material'
import vertexShader from '../shaders/vertex.glsl'
import vertexInstanceShader from '../shaders/vertex_instance.glsl'

export default class MSingleColor extends Material {
  constructor(options = { color }) {
    super()
    this.options = options
    this.vertexShader = options.instance ? vertexInstanceShader : vertexShader
    this.fragmentShader = this.fragmentShader()
    this.initProgram()
  }

  fragmentShader() {
   
    const shaderSrc = `#version 300 es
      precision mediump float;
      out vec4 FragColor;
      uniform vec3 color;
      void main() {
        FragColor = vec4(color, 1.0);
      }
    `
    return shaderSrc
  }

  bindUniform() {
    super.bindUniform()
    const { color } = this.options
    const gl = window.gl
    gl.uniform3fv(gl.getUniformLocation(this.glProgram, `color`), color)
  }
}