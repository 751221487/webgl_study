import Light from '../core/light'

export default class SkyLight extends Light {
  constructor({color = [0.1, 0.1, 0.1]}) {
    super(color)
    this.type = 'sky'
  }
}