import './utils/webgl-utils.js'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

import { angle2Radian } from './utils/Math.js'

import Scene from './core/scene'
import Camera from './core/camera'
import Cube from './shapes/cube'


// Get A WebGL context
var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl2");
window.gl = gl
gl.enable(gl.DEPTH_TEST)

const scene = new Scene()

const cam = new Camera()
scene.setMainCamera(cam)


const cubePositions = [
  [ 0.0,  0.0,  0.0],
  [ 2.0,  5.0, -15.0],
  [-1.5, -2.2, -2.5],
  [-3.8, -2.0, -12.3],
  [ 2.4, -0.4, -3.5],
  [-1.7,  3.0, -7.5],
  [ 1.3, -2.0, -2.5],
  [ 1.5,  2.0, -2.5],
  [ 1.5,  0.2, -1.5],
  [-1.3,  1.0, -1.5]
]

cubePositions.forEach((item, i) => {
  const cube = new Cube()

  cube.scale([0.5, 0.5, 0.5])
  cube.rotate(angle2Radian(20 * i), [1.0, 0.3, 0.5])
  cube.translate(item)

  scene.addMesh(cube)
})


scene.start()
