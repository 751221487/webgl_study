export default class Scene {
  constructor(ctx, width, height) {
    this.ctx = ctx
    this._time = 0

    this.mainCamera = null
    this.meshs = []
    this.lights = {
      sky: [],
      direct: [],
      point: []
    }
    
    this.isPause = false
  }

  setMainCamera(cam) {
    this.mainCamera = cam
    cam.setScene(this)
  }

  addMesh(o) {
    this.meshs.push(o);
  }

  addLight(l) {
    this.lights[l.type].push(l)
  }

  start() {
    this.isPause = false;
    this._loop()
  }

  _loop() {
    this._time++;
    const gl = window.gl
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    this.mainCamera._update()

    for(let i = 0, l = this.meshs.length; i < l; i++) {
      if(this.meshs[i].canDestroy) {
        delete this.meshs[i]
        this.meshs.splice(i, 1)
        i--;l--;
        continue
      }
      this.meshs[i] && this.meshs[i]._update();
    }
    window.requestAnimationFrame(this._loop.bind(this));
  }

}