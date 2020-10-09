import Light from '../core/light'

export default class DirectLight extends Light {
  constructor({color = [1, 1, 1], position = [0, 0, 0], constant = 1, linear = 0.7, quadratic = 1.8}) {
    super(color)
    this.position = position
    this.constant = constant
    this.linear = linear
    this.quadratic = quadratic
    this.type = 'point'
  }
}