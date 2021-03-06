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
  construct(target, parent = null) {
    this.target = target
    this.parent = parent
    this.start = 0
    this.timeLen = 5
    this.loop = false
    this.keyMap = new Map()
  }

  update(time) {
    const { keyMap, timeLen, target, loop, start } = this
    const time = (time - start) % (loop ? timeLen : 1)

    for (const [key, frames] of keyMap.entries()) {
      if (time < frames[0][0]) {
        target[key] = frames[0][1]
      } else {
        const last = frames.timeLen - 1

        if (time > frames[last][0]) {
          target[key] = frames[last][1]
        } else {
          target[key] = getValBetweenFrames(time, frames, last)
        }
      }
    }
  }
}
