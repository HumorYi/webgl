/*
1.寻找满足以下条件的▲ABC：

- ▲ABC的顶点索引位置连续，如012,123、234
- 点C在向量AB的正开半平面里，可以理解为你站在A点，面朝B点，点C要在你的左手边
- ▲ABC中没有包含路径G 中的其它顶点

2.当找到▲ABC 后，就将点B从路径的顶点集合中删掉，然后继续往后找。

3.当路径的定点集合只剩下3个点时，就结束。

4.由所有满足条件的▲ABC构成的集合就是要求的独立三角形集合。
*/

export default class ShapeGeo {
  constructor(pathData = []) {
    // 平展开的路径数据
    this.pathData = pathData
    // 由路径数据pathData 转成的对象型数组
    this.geoData = []
    // 三角形集合，对象型数组
    this.triangles = []
    // 平展开的对立三角形顶点集合
    this.vertices = []

    this.pointQuantity = 3

    this.parsePath()

    this.update()
  }

  // 基于pathData 生成vertices
  update() {
    this.triangles = []
    this.vertices = []

    this.findTriangle(0)

    this.updateVertices()
  }

  // 基于路径数据pathData 转成对象型数组
  parsePath() {
    const geoData = []
    const pathData = this.pathData
    const pathDataLen = pathData.length

    for (let i = 0; i < pathDataLen; i += 2) {
      geoData.push({ x: pathData[i], y: pathData[i + 1] })
    }

    this.geoData = geoData
  }

  // 寻找符合条件的三角形
  // i 顶点在geoData 中的索引位置，表示从哪里开始寻找三角形
  findTriangle(i) {
    const { geoData, triangles } = this
    const geoDataLen = geoData.length
    if (geoData.length <= this.pointQuantity) {
      triangles.push([...geoData])
      return
    }

    const indexList = []
    const triangle = []
    for (let j = 0; j < this.pointQuantity; j++) {
      const index = (i + j) % geoDataLen
      indexList.push(index)
      triangle.push(geoData[index])
    }

    if (this.cross(triangle) > 0 && !this.includePoint(triangle)) {
      triangles.push(triangle)
      geoData.splice(indexList[1], 1)
    }

    this.findTriangle(indexList[1])
  }

  // 判断三角形中是否有其它顶点
  includePoint(triangle) {
    return this.geoData.some(ele => !triangle.includes(ele) && this.inTriangle(ele, triangle))
  }

  // 判断一个顶点是否在三角形中
  inTriangle(p0, triangle) {
    for (let i = 0; i < this.pointQuantity; i++) {
      const j = (i + 1) % this.pointQuantity
      const [p1, p2] = [triangle[i], triangle[j]]

      if (this.cross([p0, p1, p2]) < 0) {
        return false
      }
    }

    return true
  }

  // 以p0为基点，对二维向量p0p1、p0p2做叉乘运算，大于0在左边，小于0在右边
  cross([p0, p1, p2]) {
    const [ax, ay, bx, by] = [p1.x - p0.x, p1.y - p0.y, p2.x - p0.x, p2.y - p0.y]

    return ax * by - bx * ay
  }

  // 基于对象数组geoData 生成平展开的vertices 数据
  updateVertices() {
    const arr = []
    this.triangles.forEach(triangle => {
      for (let { x, y } of triangle) {
        arr.push(x, y)
      }
    })
    this.vertices = arr
  }
}
