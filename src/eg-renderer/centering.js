export const layoutRect = ({vertices}) => {
  const keys = Object.keys(vertices)
  const left = Math.min(...keys.map((u) => vertices[u].x - vertices[u].width / 2))
  const right = Math.max(...keys.map((u) => vertices[u].x + vertices[u].width / 2))
  const top = Math.min(...keys.map((u) => vertices[u].y - vertices[u].height / 2))
  const bottom = Math.max(...keys.map((u) => vertices[u].y + vertices[u].height / 2))
  return {
    layoutWidth: right - left,
    layoutHeight: bottom - top
  }
}

export const centerTransform = (lWidth, lHeight, cWidth, cHeight, margin) => {
  const aWidth = cWidth - 2 * margin
  const aHeight = cHeight - 2 * margin
  const hScale = aWidth / lWidth
  const vScale = aHeight / lHeight
  const scale = Math.min(hScale, vScale)
  const x = hScale < vScale ? 0 : (aWidth - lWidth * scale) / 2
  const y = vScale < hScale ? 0 : (aHeight - lHeight * scale) / 2
  return {x, y, k: scale}
}
