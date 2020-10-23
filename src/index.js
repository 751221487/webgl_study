import './utils/webgl-utils.js'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

import { angle2Radian } from './utils/Math.js'

import Scene from './core/scene'
import Camera from './core/camera'
import MeshGroup from './core/meshGroup'
import Cube from './shapes/cube'
import Plane from './shapes/plane'

import SkyLight from './light/skyLight'
import DirectLight from './light/directLight'
import PointLight from './light/pointLight'

import MPhong from './materials/phong'
import MHighlight from './materials/highlight'

import Inversion from './postprocess/inversion'
import Kernel from './postprocess/kernel'

import Skybox from './core/skybox'

import pic from '../assets/imgs/awesomeface.png'
import woodFloor from '../assets/imgs/wood-floor.jpg'

import skybox_right from '../assets/imgs/skybox/right.jpg'
import skybox_left from '../assets/imgs/skybox/left.jpg'
import skybox_top from '../assets/imgs/skybox/top.jpg'
import skybox_bottom from '../assets/imgs/skybox/bottom.jpg'
import skybox_front from '../assets/imgs/skybox/front.jpg'
import skybox_back from '../assets/imgs/skybox/back.jpg'

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

// scene.setSkybox(new Skybox({
//   images: [
//     skybox_right,
//     skybox_left,
//     skybox_top,
//     skybox_bottom,
//     skybox_front,
//     skybox_back
//   ]
// }))

// scene.setPostProcess(new Inversion())
// scene.setPostProcess(new Kernel())

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

function rand() {
  return parseInt(Math.random() * 10000000)
}

const cubeGroup = []
const amount = 1000
const radius = 150.0
const offset = 25.0
for (let i = 0; i < amount; i++) {
  const cube = new Cube()
  cube.setMaterial(mat1)
  let angle = i / amount * 360;
  let displacement = (rand() % parseInt(2 * offset * 100)) / 100.0 - offset
  let x = Math.sin(angle) * radius + displacement;
  displacement = (rand() % parseInt(2 * offset * 100)) / 100.0 - offset
  let y = displacement * 0.4
  displacement = (rand() % parseInt(2 * offset * 100)) / 100.0 - offset
  let z = Math.cos(angle) * radius + displacement;
  cube.translate([x, y, z])

  let scale = (rand() % 20) / 100.0 + 0.05
  cube.scale([scale, scale, scale])

  let rotAngle = rand() % 360
  cube.rotate(rotAngle, [0.4, 0.6, 0.8])

  cubeGroup.push(cube)
}

scene.addMeshGroup(new MeshGroup(cubeGroup))

const plane = new Plane()
plane.setMaterial(mat3)
plane.translate([0, -1, 0])
plane.scale([2, 2, 2])
scene.addMesh(plane)

scene.start()
