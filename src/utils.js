export const centerGameObjects = (objects) => {
  objects.forEach(function (object) {
    object.anchor.setTo(0.5)
  })
}

export function clamp(i, min, max) {
  if(i < min)
    return min
  else if (i > max)
    return max
  else
    return i
}

export function coordinates(X, Y, width, height) {
  return {
    x: X * width,
    y: Y * height
  }
}