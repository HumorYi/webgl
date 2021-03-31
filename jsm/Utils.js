function initShaders(gl, vsSource, fsSource) {
  //创建程序对象
  const program = gl.createProgram()
  //建立着色对象
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)
  //把顶点着色对象装进程序对象中
  gl.attachShader(program, vertexShader)
  //把片元着色对象装进程序对象中
  gl.attachShader(program, fragmentShader)
  //连接webgl上下文对象和程序对象
  gl.linkProgram(program)
  //启动程序对象
  gl.useProgram(program)
  //将程序对象挂到上下文对象上
  gl.program = program

  return true
}

function loadShader(gl, type, source) {
  //根据着色类型，建立着色器对象
  const shader = gl.createShader(type)
  //将着色器源文件传入着色器对象中
  gl.shaderSource(shader, source)
  //编译着色器对象
  gl.compileShader(shader)

  //返回着色器对象
  return shader
}

function getMousePosInWebgl({ clientX, clientY }, canvas) {
  // 因为html 坐标系中的坐标原点和轴向与canvas 2d是一致的，所以在没有用css 改变画布大小，
  // 也没有对其坐标系做变换的情况下，鼠标点在canvas 画布中的css 位就是鼠标点在canvas 2d坐标系中的位置。
  const { left, top, width, height } = canvas.getBoundingClientRect()
  const [cssX, cssY] = [clientX - left, clientY - top]

  // 解决坐标原点位置的差异，canvas原点在左上角，webgl原点在中心点
  const [halfWidth, halfHeight] = [width / 2, height / 2]
  const [canvasCenterX, canvasCenterY] = [halfWidth, halfHeight]
  // 用鼠标位减去canvas 画布的中心位，得到的就是鼠标基于画布中心的位置
  const [xBaseCenter, yBaseCenter] = [cssX - canvasCenterX, cssY - canvasCenterY]

  // 解决 y 方向的差异，canvas y轴向下为正，webgl y轴向上为正，正好相反
  const yBaseCenterTop = -yBaseCenter

  // 解决坐标基底的差异
  // canvas 2d坐标基底两个分量分别是一个像素的宽和一个像素的高，即1个单位的宽便是1个像素的宽，1个单位的高便是一个像素的高
  // webgl 坐标基底两个分量分别是半个canvas的宽和canvas的高，即1个单位的宽是半个canvas的宽，1个单位的高是半个canvas的高
  const [x, y] = [xBaseCenter / halfWidth, yBaseCenterTop / halfHeight]

  return { x, y }
}

function render(gl, points, position, pointSize, fragColor) {
  /**
   * webgl 同步绘图原理总结

    gl.drawArrays() 方法只会同步绘图，走完了js 主线程后，再次绘图时，就会从头再来。
    也就说，异步执行的drawArrays() 方法会把画布上的图像都刷掉。

    webgl 的同步绘图的现象，其实是由webgl 底层内置的颜色缓冲区导致的。

    “胸有成竹”大家知道吧？这个颜色缓冲区就是“胸有成竹”的胸，它在电脑里会占用一块内存。在我们使用webgl 绘图的时候，是先在颜色缓冲区中画出来，这样的图像还在胸中，所以外人看不见，只有webgl系统自己知道。

    在我们想要将图像显示出来的时候，那就照着颜色缓冲区中的图像去画，这个步骤是webgl 内部自动完成的，我们只要执行绘图命令即可。

    颜色缓冲区中存储的图像，只在当前线程有效。比如我们先在js 主线程中绘图，主线程结束后，会再去执行信息队列里的异步线程。在执行异步线程时，颜色缓冲区就会被webgl 系统重置，我们曾经在主线程里的“胸有成竹”也就没了，既然没了，也就画不出那时的图像了。
   */

  // 使用之前指定的颜色，清空绘图区
  gl.clear(gl.COLOR_BUFFER_BIT)

  points.forEach(({ x, y, size, color }) => {
    if (position !== undefined && typeof x === 'number' && typeof y === 'number') {
      gl.vertexAttrib2f(position, x, y)
    }

    if (pointSize !== undefined && typeof size === 'number') {
      gl.vertexAttrib1f(pointSize, size)
    }

    if (fragColor !== undefined && color) {
      const { r, g, b, a } = color
      // gl.uniform4f(fragColor, r, g, b, a)

      // uniform4fv() 方法的第二个参数必须是Float32Array 数组，不要使用普通的 Array 对象。
      // Float32Array 是一种 32 位的浮点型数组，它在浏览器中的运行效率要比普通的 Array 高很多。
      gl.uniform4fv(fragColor, new Float32Array([r, g, b, a]))
    }

    gl.drawArrays(gl.POINTS, 0, 1)
  })
}

function glToCssPos({ x, y }, { width, height }) {
  const [halfWidth, halfHeight] = [width / 2, height / 2]

  return {
    x: x * halfWidth,
    y: -y * halfHeight
  }
}

export { initShaders, getMousePosInWebgl, glToCssPos, render }
