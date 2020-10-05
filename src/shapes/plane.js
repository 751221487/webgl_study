import Mesh from '../core/mesh'

export default class Cube extends Mesh {
  constructor() {
    const plane = {
      vertex: [
        -1.0, 0.0, -1.0,
        1.0, 0.0, -1.0,
        1.0, 0.0, 1.0,
        1.0, 0.0, 1.0, 
        -1.0, 0.0, 1.0, 
        -1.0, 0.0, -1.0,
      ],
      normal: [
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
      ],
      texCoord: [
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
      ]
    }
    super(plane)
  }
}