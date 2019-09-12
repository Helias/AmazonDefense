import { SETTINGS } from './settings'

export function clamp(i, min, max) {
  if(i < min)
    return min
  else if (i > max)
    return max
  else
    return i
}

export function coordinates(X, Y) {
  return {
    x: X * SETTINGS.canvasWidth,
    y: Y * SETTINGS.canvasHeight
  }
}

export function dist(x0, y0, x1, y1) {
    let xDiff = (x0 - x1)
    let yDiff = (y0 - y1)

    return Math.sqrt(xDiff * xDiff + yDiff * yDiff)
}

