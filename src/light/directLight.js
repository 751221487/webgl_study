import Light from '../core/light'
import vertexShader from '../shaders/shadow/vertex.glsl'
import fragmentShader from '../shaders/shadow/fragment.glsl'
import { multiple, ortho, lookAt, toArray } from '../utils/Matrix'

export default class DirectLight extends Light {
  constructor({color = [1, 1, 1], direction = [0, 0, 1]}) {
    super(color)
    this.direction = direction
    this.type = 'direct'
    this.vertexShader = vertexShader
    this.fragmentShader = fragmentShader
    this.initProgram()
  }

  initProgram() {
    const gl = window.gl
    var program = createProgramFromSources(gl, [this.vertexShader, this.fragmentShader]);
    this.glProgram = program
    gl.useProgram(this.glProgram)
    this.bindBuffer()
  }

  bindBuffer() {
    const SHADOW_WIDTH = 1024, SHADOW_HEIGHT = 1024
    const depthMapFBO = gl.createFramebuffer()
    const depthMap = gl.createTexture()

    gl.bindTexture(gl.TEXTURE_2D, depthMap)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, SHADOW_WIDTH, SHADOW_HEIGHT, 0, gl.DEPTH_COMPONENT, gl.FLOAT, 0)

    gl.bindFramebuffer(gl.FRAMEBUFFER, depthMapFBO)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthMap, 0)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  renderShadow() {
    gl.useProgram(this.glProgram)
    const lightPos = [-2, 4, -1]
    const near_plane = 1.0, far_plane = 7.5
    const lightProjection = ortho(-10.0, 10.0, -10.0, 10.0, near_plane, far_plane)
    const lightView = lookAt(lightPos, [0, 0, 0], [0, 1, 0])
    const lightSpaceMatrix = toArray(multiple(lightProjection, lightView))

    const lightSpaceMatrixLocation = gl.getUniformLocation(this.glProgram, "lightSpaceMatrix")
    gl.uniformMatrix4fv(lightSpaceMatrixLocation, false, lightSpaceMatrix)
  }

}