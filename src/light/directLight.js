import Light from '../core/light'

export default class DirectLight extends Light {
  constructor({color = [1, 1, 1], direction = [0, 0, 1]}) {
    super(color)
    this.direction = direction
    this.type = 'direct'
  }
}