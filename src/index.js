import './utils/webgl-utils.js'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

import { angle2Radian } from './utils/Math.js'

import Scene from './core/scene'
import Camera from './core/camera'
import Cube from './shapes/cube'
import Plane from './shapes/plane'

import SkyLight from './light/skyLight'
import DirectLight from './light/directLight'
import PointLight from './light/pointLight'

import MPhong from './materials/phong'
import MHighlight from './materials/highlight'
import pic from '../assets/imgs/awesomeface.png'
import woodFloor from '../assets/imgs/wood-floor.jpg'

var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl2", { stencil: true });
window.gl = gl
gl.enable(gl.DEPTH_TEST)

const scene = new Scene()
window.scene = scene

const cam = new Camera()
scene.setMainCamera(cam)

scene.addLight(new SkyLight({
  color: [0.2, 0.2, 0.2]
}))
scene.addLight(new DirectLight({
  color: [0.2, 0.4, 0.6],
  direction: [0, 1, -1]
}))
scene.addLight(new DirectLight({
  color: [0, 1, 1],
  direction: [1, 0, 0]
}))

scene.addLight(new PointLight({
  color: [1, 1, 1],
  position: [0.5, -0.5, 0.5]
}))

const mat1 = new MPhong({
  diffuse: [1, 0, 0],
  specular: [1, 1, 1]
})

const mat2 = new MPhong({
  diffuse: pic,
  specular: [1, 1, 0]
})

const mat3 = new MPhong({
  diffuse: woodFloor,
  specular: [1, 1, 1]
})

const cubePositions = [
  [ 0.0,  0.0,  0.0],
  [-1.5, 2.2, -2.5],
  [ 1.5,  0.2, -1.5],
  [-1.3,  1.0, -1.5]
]

cubePositions.forEach((item, i) => {
  const cube = new Cube()

  if(i === 3) {
    cube.setHighlight()
    cube.update = () => {
      cube.rotate(angle2Radian(2 * cube._time), [0, 1, 0])
    }
  }

  cube.setMaterial(i % 2 === 0 ? mat2 : mat1)
  cube.scale([0.5, 0.5, 0.5])
  cube.rotate(angle2Radian(20 * i), [1.0, 0.3, 0.5])
  cube.translate(item)

  scene.addMesh(cube)
})

const plane = new Plane()
plane.setMaterial(mat3)
plane.translate([0, -1, 0])
plane.scale([2, 2, 2])
scene.addMesh(plane)

scene.start()
