export const layoutRect = ({vertices}) => {
  vertices = Array.from(vertices.values())
  const left = Math.min(...vertices.map(({x, width}) => x - width / 2))
  const right = Math.max(...vertices.map(({x, width}) => x + width / 2))
  const top = Math.min(...vertices.map(({y, height}) => y - height / 2))
  const bottom = Math.max(...vertices.map(({y, height}) => y + height / 2))
  return {
    left: left,
    top: top,
    layoutWidth: right - left,
    layoutHeight: bottom - top
  }
}

export const centerTransform = (lWidth, lHeight, left, top, cWidth, cHeight, margin) => {
  const aWidth = cWidth - 2 * margin
  const aHeight = cHeight - 2 * margin
  const hScale = aWidth / lWidth
  const vScale = aHeight / lHeight
  const scale = Math.min(hScale, vScale)
  const x = hScale < vScale ? 0 : (aWidth - lWidth * scale) / 2
  const y = vScale < hScale ? 0 : (aHeight - lHeight * scale) / 2
  return {x, y, k: scale}
}
