function getValBetweenFrames(time, frames, last) {
  for (let i = 0; i < last; i++) {
    const [currentTime, currentVal] = frames[i]
    const [nextTime, nextVal] = frames[i + 1]

    if (time >= currentTime && time <= nextTime) {
      const delta = {
        x: nextTime - currentTime,
        y: nextVal - currentVal
      }

      const k = delta.y / delta.x
      const b = currentVal - currentTime * k

      return k * time + b
    }
  }
}

export default class Track {
  constructor(target, parent = null) {
    this.target = target
    this.parent = parent
    this.start = 0
    this.timeLen = 5
    this.loop = false
    this.keyMap = new Map()
  }

  update(time) {
    const { keyMap, timeLen, target, loop, start } = this

    const currentTime = (time - start) % (loop ? timeLen : 1)

    for (const [key, frames] of keyMap.entries()) {
      let val = ''

      if (currentTime < frames[0][0]) {
        val = frames[0][1]
      } else {
        const last = frames.length - 1

        if (currentTime > frames[last][0]) {
          val = frames[last][1]
        } else {
          val = getValBetweenFrames(currentTime, frames, last)
        }
      }

      target[key] = val
    }
  }
}
