import { toArray } from '../utils/Matrix'
import vertexShader from '../shaders/skybox/vertex.glsl'
import fragmentShader from '../shaders/skybox/fragment.glsl'

export default class Skybox {
  constructor(options = { images: [] }) {
    this.mesh = {}
    this.options = options
    this.vertex = [
        -1.0,  1.0, -1.0,
        -1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
        -1.0,  1.0, -1.0,

        -1.0, -1.0,  1.0,
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
        -1.0, -1.0,  1.0,

         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0, -1.0,
         1.0, -1.0, -1.0,

        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        -1.0,  1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0,

        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0
    ]
    this.texture = null
    this.vertexShader = vertexShader
    this.fragmentShader = fragmentShader
    this.vao = gl.createVertexArray()
    this.initProgram()
    this.init()
  }

  initProgram() {
    const gl = window.gl
    var program = createProgramFromSources(gl, [this.vertexShader, this.fragmentShader]);
    this.glProgram = program
  }

  init() {
    gl.bindVertexArray(this.vao)
    gl.useProgram(this.glProgram)
    this.bindAttrLocation()
    gl.bindVertexArray(null)
    this.bindUniform()
    this.loadImage()
  }

  bindAttrLocation() {
    const gl = window.gl
    const program = this.glProgram

    const aPos = gl.getAttribLocation(program, "aPos")

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertex), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0)
  }

  bindUniform() {
    const cam = window.scene.mainCamera
    const gl = window.gl
    const projection = toArray(cam.projection)
    const mat4Projection = gl.getUniformLocation(this.glProgram, "m_projection")
    gl.uniformMatrix4fv(mat4Projection, false, projection)
  }

  loadImage(src) {
    var texture = gl.createTexture();
    this.texture = texture
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture)
    let loadedCnt = 0
    for(let i = 0; i < 6; i++) {
      const image = new Image()
      image.src = this.options.images[i]
      image.onload = () => {
        gl.useProgram(this.glProgram)
        gl.activeTexture(gl.TEXTURE0)
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
        loadedCnt++
        if(loadedCnt === 5) {
          // Set the parameters so we can render any size image.
          gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
          gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
          gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE)
          gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
          gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        }
      }
    }
  }

  render() {
    const gl = window.gl
    const cam = window.scene.mainCamera
    const camView = cam.getViewMatrix()

    camView[0][3] = 0
    camView[1][3] = 0
    camView[2][3] = 0
    camView[3][0] = 0
    camView[3][1] = 0
    camView[3][2] = 0
    camView[3][3] = 1

    const view = toArray(camView)

    gl.bindVertexArray(this.vao)
    gl.useProgram(this.glProgram)
    gl.depthFunc(gl.LEQUAL)
    const mat4View = gl.getUniformLocation(this.glProgram, "m_view")

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture)

    gl.uniformMatrix4fv(mat4View, false, view)
    // draw
    gl.drawArrays(gl.TRIANGLES, 0, 36);
    gl.depthFunc(gl.LESS)
    gl.bindVertexArray(null)
  }
}