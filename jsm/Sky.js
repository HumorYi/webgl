export default class Sky {
  constructor(gl) {
    this.gl = gl
    this.children = []
  }

  add(obj) {
    obj.gl = this.gl
    this.children.push(obj)
  }

  updateVertices(params) {
    this.children.forEach(ele => ele.updateVertices(params))
  }

  draw() {
    this.children.forEach(ele => {
      ele.init()
      ele.draw()
    })
  }
}
