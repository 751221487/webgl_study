import { unit, rotation, toArray, translate, scale, multiple } from '../utils/Matrix'
import { numberMultiple, castTo } from '../utils/Vector'

import vertexShader from '../shaders/vertex.glsl'
import fragmentShader from '../shaders/fragment.glsl'

import pic from '../../assets/imgs/awesomeface.png'

export default class Mesh {
  constructor(data, options = {}) {
    this.vertex = data.vertex
    this.normal = data.normal
    this.texCoord = data.texCoord
    this.transform = options.transform || unit(4)
    if(typeof options.update === 'function') {
      this.update = options.update.bind(this)
    }
    this.image = new Image();
    this.image.src = pic
    this.ready = false
    this.image.onload = () => {
      this.initDraw()
      this.ready = true
    }
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

  initDraw() {
    const gl = window.gl
    var program = createProgramFromSources(gl, [vertexShader, fragmentShader]);
    this.glProgram = program
    gl.useProgram(program);
    const aPos = gl.getAttribLocation(program, "aPos")
    const aTexCoord = gl.getAttribLocation(program, "aTexCoord")
    const aNormal = gl.getAttribLocation(program, "aNormal")

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertex), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0)

    const texcoordBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCoord), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(aTexCoord);
    gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 0, 0)

    const normalBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(aNormal);
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0)

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
  }

  _render() {
    if(!this.ready) {
      return
    }
    const cam = this.scene.mainCamera

    const transform = toArray(this.transform)
    const view = toArray(cam.getViewMatrix())
    const projection = toArray(cam.projection)

    const gl = window.gl

    gl.useProgram(this.glProgram);
    const mat4Model = gl.getUniformLocation(this.glProgram, "m_model")
    const mat4View = gl.getUniformLocation(this.glProgram, "m_view")
    const mat4Projection = gl.getUniformLocation(this.glProgram, "m_projection")
    const camPosition = gl.getUniformLocation(this.glProgram, "viewPos")
    const lightDirection = gl.getUniformLocation(this.glProgram, "light.direction")
    const lightAmbient = gl.getUniformLocation(this.glProgram, "light.ambient")
    const lightDiffuse = gl.getUniformLocation(this.glProgram, "light.diffuse")
    const lightSpecular = gl.getUniformLocation(this.glProgram, "light.specular")

    gl.uniformMatrix4fv(mat4Model, false, transform)
    gl.uniformMatrix4fv(mat4View, false, view)
    gl.uniformMatrix4fv(mat4Projection, false, projection)
    gl.uniform3fv(camPosition, cam.Position)
    gl.uniform3fv(lightDirection, [0, 0, -3])
    gl.uniform3fv(lightAmbient, [0.2, 0.2, 0.2])
    gl.uniform3fv(lightDiffuse, [1.0, 0.5, 0.3])
    gl.uniform3fv(lightSpecular, [1.0, 1.0, 1.0])

    // draw
    gl.drawArrays(gl.TRIANGLES, 0, this.vertex.length / 3);
  }

}