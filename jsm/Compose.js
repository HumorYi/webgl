export default class Compose {
  constructor(parent = null) {
    this.parent = parent
    this.children = []
  }

  add(obj) {
    if (this.parent === null) {
      this.parent = this
    }

    this.children.push(obj)
  }

  update(time) {
    this.children.forEach(function (child) {
      child.update(time)
    })
  }
}
