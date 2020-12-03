import { toArray } from '../utils/Matrix'

export default class PostProcess {
  constructor() {
    this.mesh = {}
    this.textures = []
    this.textureIndex = 0
    this.frameBuffer = null
    this.textureColorbuffer = null
    this.renderbuffer = null
    this.vao = gl.createVertexArray()
  }

  initProgram() {
    const gl = window.gl
    var program = createProgramFromSources(gl, [this.vertexShader, this.fragmentShader]);
    this.glProgram = program
    this.init()
  }

  init() {
    gl.bindVertexArray(this.vao)
    gl.useProgram(this.glProgram)
    this.bindBuffer()
    gl.bindVertexArray(null)
  }

  bindBuffer() {
    const gl = window.gl
    const program = this.glProgram
    gl.useProgram(this.glProgram)

    const aPos = gl.getAttribLocation(program, "aPos")
    const aTexCoord = gl.getAttribLocation(program, "aTexCoord")

    const vertex = [
      -1.0,  1.0,
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
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
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const texcoordBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoord), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(aTexCoord);
    gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 0, 0)

    let frameBuffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)
    this.frameBuffer = frameBuffer
    frameBuffer.width = gl.canvas.clientWidth
    frameBuffer.height = gl.canvas.clientHeight

    let textureColorbuffer = gl.createTexture()
    this.textureColorbuffer = textureColorbuffer
    gl.bindTexture(gl.TEXTURE_2D, textureColorbuffer)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, frameBuffer.width, frameBuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)

    let renderbuffer = gl.createRenderbuffer()
    this.renderbuffer = renderbuffer
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer)
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, frameBuffer.width, frameBuffer.height)

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textureColorbuffer, 0)
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer)
  }

  render() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.disable(gl.DEPTH_TEST)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT)

    gl.useProgram(this.glProgram)

    gl.bindVertexArray(this.vao)
    gl.bindTexture(gl.TEXTURE_2D, this.textureColorbuffer)
    gl.drawArrays(gl.TRIANGLES, 0, 6)

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)
    gl.enable(gl.DEPTH_TEST)
  }
}