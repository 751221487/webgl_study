import { angle2Radian } from '../utils/Math'
import { cross, normalize, add, numberMultiple } from '../utils/Vector'
import { lookAt } from '../utils/Matrix'
import Control from './control'

export default class Camera {
  constructor() {
    this.Position = [0, 0, 5]
    this.Front = [0, 0, 0]
    this.Up = [0, 0, 0]
    this.Right = [0, 0, 0]
    this.WorldUp = [0, 1, 0]
    // Euler Angles
    this.Yaw = -90
    this.Pitch = 0
    // Camera options
    this.MovementSpeed = 0.03
    this.MouseSensitivity = 0.2
    this.updateVector()
  }

  setScene(scene) {
    this.scene = scene
  }

  getViewMatrix() {
    return lookAt(this.Position, this.Front, this.Up);
  }

  updateVector() {
    let direction = [0, 0, 0]
    direction[0] = Math.cos(angle2Radian(this.Pitch)) * Math.cos(angle2Radian(this.Yaw));
    direction[1] = Math.sin(angle2Radian(this.Pitch))
    direction[2] = Math.cos(angle2Radian(this.Pitch)) * Math.sin(angle2Radian(this.Yaw));
    this.Front = normalize(direction)
    this.Right = normalize(cross(this.Front, this.WorldUp));
    this.Up = normalize(cross(this.Right, this.Front));
  }

  move(direction) {
    const velocity = this.MovementSpeed;
    switch (direction) {
      case 'FORWARD':
          this.Position = add(this.Position, numberMultiple(this.Front, velocity))
          break;
      case 'BACKWARD':
          this.Position = add(this.Position, numberMultiple(this.Front, -velocity))
          break;
      case 'LEFT':
          this.Position = add(this.Position, numberMultiple(this.Right, -velocity))
          break;
      case 'RIGHT':
          this.Position = add(this.Position, numberMultiple(this.Right, velocity))
          break;
      default:
          break;
    }
  }

  processMouse() {
    if(!Control.getKey('lm')) {
      return
    }
    const xoffset = Control.getMouse('x') * this.MouseSensitivity
    const yoffset = -Control.getMouse('y') * this.MouseSensitivity
    
    this.Yaw   += xoffset;
    this.Pitch += yoffset;

    if (this.Pitch > 89.0) {
      this.Pitch = 89.0
    }
    
    if (this.Pitch < -89.0) {
      this.Pitch = -89.0
    }
  }

  _update() {
    //w
    if(Control.getKey(87)) {
      this.move('FORWARD')
    }
    //s
    if(Control.getKey(83)) {
      this.move('BACKWARD')
    }
    //a
    if(Control.getKey(65)) {
      this.move('LEFT')
    }
    //d
    if(Control.getKey(68)) {
      this.move('RIGHT')
    }
    this.processMouse()
    this.updateVector()
  }

}