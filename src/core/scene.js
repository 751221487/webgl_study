export default class Scene {
  constructor(ctx, width, height) {
    this.ctx = ctx
    this._time = 0

    this.mainCamera = null
    this.meshs = []
    this.meshGroups = []
    this.skybox = null
    this.lights = {
      sky: [],
      direct: [],
      point: []
    }
    this.postProces = null
    
    this.isPause = false
  }

  setMainCamera(cam) {
    this.mainCamera = cam
    cam.setScene(this)
  }

  setPostProcess(postprocess) {
    this.postprocess = postprocess
  }

  setSkybox(skybox) {
    this.skybox = skybox
  }

  addMesh(o) {
    this.meshs.push(o);
  }

  addMeshGroup(o) {
    this.meshGroups.push(o)
  }

  addLight(l) {
    this.lights[l.type].push(l)
  }

  start() {
    this.isPause = false;
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LESS)
    gl.enable(gl.STENCIL_TEST)
    gl.stencilFunc(gl.NOTEQUAL, 1, 0xFF)
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE)
    this._loop()
  }

  _loop() {
    this._time++;
    const gl = window.gl
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT)
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
    for(let i = 0, l = this.meshGroups.length; i < l; i++) {
      if(this.meshGroups[i].canDestroy) {
        delete this.meshGroups[i]
        this.meshGroups.splice(i, 1)
        i--;l--;
        continue
      }
      this.meshGroups[i] && this.meshGroups[i]._update();
    }
    if(this.skybox) {
      this.skybox.render()
    }
    if(this.postprocess) {
      this.postprocess.render()
    }
    window.requestAnimationFrame(this._loop.bind(this));
  }

}