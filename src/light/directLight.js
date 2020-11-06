import Light from '../core/light'
import vertexShader from '../shaders/shadow/vertex.glsl'
import fragmentShader from '../shaders/shadow/fragment.glsl'
import { multiple, ortho, lookAt } from '../utils/Matrix'

export default class DirectLight extends Light {
  constructor({color = [1, 1, 1], direction = [0, 0, 1]}) {
    super(color)
    this.direction = direction
    this.type = 'direct'
    this.vertexShader = vertexShader
    this.fragmentShader = fragmentShader
    this.initProgram()
  }

}