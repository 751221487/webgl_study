import vertexShader from '../shaders/shadow/vertex.glsl'
import fragmentShader from '../shaders/shadow/fragment.glsl'

import vertexDebugShader from '../shaders/shadow/vertex_debug.glsl'
import fragmentDebugShader from '../shaders/shadow/fragment_debug.glsl'

import { multiple, ortho, lookAt, toArray } from '../utils/Matrix'

export default class Shadow {
  constructor(material) {
    this.vertexShader = vertexShader
    this.fragmentShader = fragmentShader
    this.depthMapFBO = null
    this.depthMap = null
    this.material = material
    this.initProgram()
    this.initDebugProgram()
  }

  initProgram() {
    const gl = window.gl
    var program = createProgramFromSources(gl, [this.vertexShader, this.fragmentShader]);
    this.glProgram = program
    gl.useProgram(this.glProgram)
    this.bindBuffer()
  }

  initDebugProgram() {
    const gl = window.gl
    this.debugProgram = createProgramFromSources(gl, [vertexDebugShader, fragmentDebugShader]);
    this.debugVao = gl.createVertexArray()
    gl.bindVertexArray(this.debugVao)
    gl.useProgram(this.debugProgram)

    const aPos = gl.getAttribLocation(this.debugProgram, "aPos")
    const aTexCoord = gl.getAttribLocation(this.debugProgram, "aTexCoord")

    const vertex = [
      -1.0,  1.0, 0.0,
      -1.0, -1.0, 0.0,
       1.0, -1.0, 0.0,
      -1.0,  1.0, 0.0,
       1.0, -1.0, 0.0,
       1.0,  1.0, 0.0,
    ]

    const texCoord = [
      0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      1.0, 0.0,
      1.0, 1.0
    ]

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0)

    const texcoordBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoord), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(aTexCoord);
    gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 0, 0)
  }

  bindBuffer() {
    const SHADOW_WIDTH = 1024, SHADOW_HEIGHT = 1024
    this.depthMapFBO = gl.createFramebuffer()
    this.depthMap = gl.createTexture()

    gl.bindTexture(gl.TEXTURE_2D, this.depthMap)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT32F, SHADOW_WIDTH, SHADOW_HEIGHT, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null)
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SHADOW_WIDTH,  SHADOW_HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.depthMapFBO)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthMap, 0)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  render(options = {}) {
    gl.useProgram(this.glProgram)
    const { material } = this
    const lightPos = [-2, 4, -1]
    const near_plane = 1.0, far_plane = 7.5
    const lightProjection = ortho(-10.0, 10.0, -10.0, 10.0, near_plane, far_plane)
    const lightView = lookAt(lightPos, [0, 0, 0], [0, 1, 0])
    const lightSpaceMatrix = toArray(multiple(lightProjection, lightView))

    const lightSpaceMatrixLocation = gl.getUniformLocation(this.glProgram, "lightSpaceMatrix")
    gl.uniformMatrix4fv(lightSpaceMatrixLocation, false, lightSpaceMatrix)
    gl.bindVertexArray(material.vao)

    const transform = toArray(material.mesh.transform)
    const mat4Model = gl.getUniformLocation(this.glProgram, "m_model")
    gl.uniformMatrix4fv(mat4Model, false, transform)

    const nearPlaneLocation = gl.getUniformLocation(this.glProgram, "near_plane")
    gl.uniform1f(nearPlaneLocation, false, 1.0)
 
    const farPlaneLocation = gl.getUniformLocation(this.glProgram, "far_plane")
    gl.uniform1f(farPlaneLocation, false, 7.5)
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.depthMapFBO)
    if(options.count) {
      gl.drawArraysInstanced(gl.TRIANGLES, 0, material.mesh.vertex.length / 3, options.count)
    } else {
      gl.drawArrays(gl.TRIANGLES, 0, material.mesh.vertex.length / 3);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    this.renderQuad()
  }
  
  renderQuad() {
    gl.bindVertexArray(this.debugVao)
    gl.useProgram(this.debugProgram)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.depthMap)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

}