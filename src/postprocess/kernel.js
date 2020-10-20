import PostProcess from '../core/postProcess'
import vertexShader from '../shaders/postprocess/vertex.glsl'
import fragmentShader from '../shaders/postprocess/kernel.glsl'

export default class Kernel extends PostProcess {
  constructor(options) {
    super()
    this.options = options
    this.vertexShader = vertexShader
    this.fragmentShader = fragmentShader
    this.initProgram()
  }
}