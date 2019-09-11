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