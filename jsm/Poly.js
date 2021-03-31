const defAttr = () => ({
  gl: null,
  vertices: [],
  geoData: [],
  size: 2,
  count: 0,
  circleDot: false,
  u_IsPOINTS: null,
  pointsAttrName: 'u_IsPOINTS',
  attrName: 'a_Position',
  types: ['POINTS']
})

export default class Poly {
  constructor(attr) {
    Object.assign(this, defAttr(), attr)

    this.init()
  }

  init() {
    const { gl, size, circleDot, attrName, pointsAttrName } = this

    if (!gl) {
      return
    }

    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

    this.updateBuffer()

    const attr = gl.getAttribLocation(gl.program, attrName)
    gl.vertexAttribPointer(attr, size, gl.FLOAT, false, 0.0, 0.0)
    gl.enableVertexAttribArray(attr)

    if (circleDot) {
      this.u_IsPOINTS = gl.getUniformLocation(gl.program, pointsAttrName)
    }
  }

  updateBuffer() {
    const { gl, vertices } = this

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

    this.updateCount()
  }

  updateCount() {
    this.count = this.vertices.length / this.size
  }

  addVertices(...params) {
    this.vertices.push(...params)

    this.updateBuffer()
  }

  popVertices() {
    const { vertices, size } = this
    const len = vertices.length

    vertices.splice(len - size, len)

    this.updateCount()
  }

  setVertices(index, ...params) {
    const { vertices, size } = this
    const verticesIndex = index * size

    params.forEach((param, paramIndex) => (vertices[verticesIndex + paramIndex] = param))
  }

  pushVertices(...params) {
    this.setVertices(this.count - 1, ...params)
  }

  updateVertices(params) {
    const { geoData } = this
    const vertices = []

    geoData.forEach(data => params.forEach(key => vertices.push(data[key])))

    this.vertices = vertices

    this.updateCount()
  }

  draw(...types) {
    const { gl, count, circleDot, u_IsPOINTS } = this
    const currentTypes = types.length ? types : this.types

    if (count === 0) {
      return
    }

    for (const type of currentTypes) {
      circleDot && gl.uniform1f(u_IsPOINTS, type === 'POINTS')
      gl.drawArrays(gl[type], 0, count)
    }
  }

  clear() {
    const { gl } = this
    gl.clear(gl.COLOR_BUFFER_BIT)
  }
}
