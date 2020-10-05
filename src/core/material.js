import { toArray } from '../utils/Matrix'

export default class Material {
  constructor() {
    this.mesh = {}
    this.images = []
    this.textureIndex = 0
    this.vao = null
  }

  init() {
    this.bindAttrLocation()
    this.bindUniform()
  }

  bindAttrLocation() {
    const gl = window.gl
    var program = createProgramFromSources(gl, [this.vertexShader, this.fragmentShader]);
    this.glProgram = program
    gl.useProgram(program)

    this.vao = gl.createVertexArray()
    gl.bindVertexArray(this.vao)

    const aPos = gl.getAttribLocation(program, "aPos")
    const aTexCoord = gl.getAttribLocation(program, "aTexCoord")
    const aNormal = gl.getAttribLocation(program, "aNormal")

    const { vertex, texCoord, normal } = this.mesh

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

    const normalBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(aNormal);
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0)

    gl.bindVertexArray(null)
  }

  bindUniform() {
    const cam = window.scene.mainCamera
    const gl = window.gl

    const transform = toArray(this.mesh.transform)
    const view = toArray(cam.getViewMatrix())
    const projection = toArray(cam.projection)

    const mat4Model = gl.getUniformLocation(this.glProgram, "m_model")
    const mat4View = gl.getUniformLocation(this.glProgram, "m_view")
    const mat4Projection = gl.getUniformLocation(this.glProgram, "m_projection")
    const camPosition = gl.getUniformLocation(this.glProgram, "viewPos")

    gl.uniformMatrix4fv(mat4Model, false, transform)
    gl.uniformMatrix4fv(mat4View, false, view)
    gl.uniformMatrix4fv(mat4Projection, false, projection)
    gl.uniform3fv(camPosition, cam.Position)
    this.bindChildUniform()
  }

  bindChildUniform() {}

  loadImage(src) {
    const image = new Image();
    image.src = src
    const textureIndex = this.textureIndex
    this.textureIndex++
    image.onload = () => {
      var texture = gl.createTexture();
      gl.activeTexture(gl['TEXTURE' + textureIndex]);
      gl.bindTexture(gl.TEXTURE_2D, texture);

      // Set the parameters so we can render any size image.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

      // Upload the image into the texture.
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    }
    return image
  }

  render() {
    const gl = window.gl
    const cam = window.scene.mainCamera
    const transform = toArray(this.mesh.transform)
    const view = toArray(cam.getViewMatrix())

    gl.bindVertexArray(this.vao)
    gl.useProgram(this.glProgram)
    const mat4Model = gl.getUniformLocation(this.glProgram, "m_model")
    const mat4View = gl.getUniformLocation(this.glProgram, "m_view")
    const camPosition = gl.getUniformLocation(this.glProgram, "viewPos")

    gl.uniformMatrix4fv(mat4Model, false, transform)
    gl.uniformMatrix4fv(mat4View, false, view)
    gl.uniform3fv(camPosition, cam.Position)
    // draw
    gl.drawArrays(gl.TRIANGLES, 0, this.mesh.vertex.length / 3);
  }
}