export default class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  NDC(width, height) {
    let x = width * (this.x + 1) / 2
    let y = height * (1 - this.y) / 2
    return new Point(x, y)
  }

  clip(width, height) {
    let x = 2 * (this.x - width / 2) / width
    let y = -2 * (this.y - height / 2) / height
    return new Point(x, y)
  }

  addVec(vec) {
    return new Point(this.x + vec[0], this.y + vec[1])
  }
}
