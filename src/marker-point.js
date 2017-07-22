const baseCircleToRectMarkerPosition = (x0, y0, x1, y1, width, height, size) => {
  const r = size / 2
  if (x0 === x1) {
    return [0, height / 2 + r]
  }
  const a = Math.abs((y0 - y1) / (x0 - x1))
  const theta = Math.atan(a)
  if (theta < Math.atan2(height / 2, width / 2 + r)) {
    return [
      width / 2 + r,
      Math.tan(theta) * (width / 2 + r)
    ]
  }
  if (theta > Math.atan2(height / 2 + r, width / 2)) {
    return [
      Math.tan(Math.PI / 2 - theta) * (height / 2 + r),
      height / 2 + r
    ]
  }
  const b = -1
  const c = y0 - a * x0
  const px = x0 + width / 2
  const py = y0 + height / 2
  const d = a * px + b * py + c
  const D = Math.sqrt((a ** 2 + b ** 2) * r ** 2 - d ** 2)
  return [
    (-a * d - b * D) / (a ** 2 + b ** 2) + px - x0,
    (-b * d + a * D) / (a ** 2 + b ** 2) + py - y0
  ]
}

const baseTriangleToRectMarkerPosition = (x0, y0, x1, y1, width, height, size) => {
  const r = size * 2 / 3
  if (x0 === x1) {
    return [0, height / 2 + r]
  }
  const a = Math.abs((y0 - y1) / (x0 - x1))
  const theta = Math.atan(a)
  if (theta < Math.atan2(height / 2, width / 2)) {
    return [
      width / 2 + Math.cos(theta) * r,
      Math.tan(theta) * width / 2 + Math.sin(theta) * r
    ]
  }
  return [
    Math.tan(Math.PI / 2 - theta) * height / 2 + Math.sin(Math.PI / 2 - theta) * r,
    height / 2 + Math.cos(Math.PI / 2 - theta) * r
  ]
}

const baseCircleToCircleMarkerPosition = (x0, y0, x1, y1, width, height, size) => {
  const r = size / 2
  if (x0 === x1) {
    return [0, height / 2 + r]
  }
  const rx = width / 2
  const ry = height / 2
  const a = Math.abs((y0 - y1) / (x0 - x1))
  const theta = Math.atan(a)
  const px = rx * ry / Math.sqrt(a ** 2 * rx ** 2 + ry ** 2)
  const py = a * px
  return [
    px + r * Math.cos(theta),
    py + r * Math.sin(theta)
  ]
}

const baseTriangleToCircleMarkerPosition = (x0, y0, x1, y1, width, height, size) => {
  const r = size * 2 / 3
  if (x0 === x1) {
    return [0, height / 2 + r]
  }
  const rx = width / 2
  const ry = height / 2
  const a = Math.abs((y0 - y1) / (x0 - x1))
  const theta = Math.atan(a)
  const px = rx * ry / Math.sqrt(a ** 2 * rx ** 2 + ry ** 2)
  const py = a * px
  return [
    px + r * Math.cos(theta),
    py + r * Math.sin(theta)
  ]
}

const markerPosition = (x, y, x0, y0, x1, y1) => {
  if (x0 < x1) {
    if (y0 < y1) {
      return [x0 + x, y0 + y]
    } else {
      return [x0 + x, y0 - y]
    }
  } else {
    if (y0 < y1) {
      return [x0 - x, y0 + y]
    } else {
      return [x0 - x, y0 - y]
    }
  }
}

const baseFunction = (markerShape, type) => {
  if (markerShape === 'circle' && type === 'rect') {
    return baseCircleToRectMarkerPosition
  }
  if (markerShape === 'triangle' && type === 'rect') {
    return baseTriangleToRectMarkerPosition
  }
  if (markerShape === 'circle' && type === 'circle') {
    return baseCircleToCircleMarkerPosition
  }
  if (markerShape === 'triangle' && type === 'circle') {
    return baseTriangleToCircleMarkerPosition
  }
  return () => [0, 0]
}

export const adjustEdge = (edge, source, target) => {
  const {points, sourceMarkerShape, sourceMarkerSize, targetMarkerShape, targetMarkerSize} = edge
  const sourceBaseFunction = baseFunction(sourceMarkerShape, source.type)
  const [x0, y0] = sourceBaseFunction(source.x, source.y, target.x, target.y, source.width, source.height, sourceMarkerSize)
  points[0] = markerPosition(x0, y0, source.x, source.y, target.x, target.y)
  const targetBaseFunction = baseFunction(targetMarkerShape, target.type)
  const [x1, y1] = targetBaseFunction(target.x, target.y, source.x, source.y, target.width, target.height, targetMarkerSize)
  points[points.length - 1] = markerPosition(x1, y1, target.x, target.y, source.x, source.y)
}
