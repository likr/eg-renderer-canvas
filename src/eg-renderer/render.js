export const renderRect = (ctx, x, y, width, height) => {
  ctx.beginPath()
  ctx.moveTo(x - width / 2, y - height / 2)
  ctx.lineTo(x + width / 2, y - height / 2)
  ctx.lineTo(x + width / 2, y + height / 2)
  ctx.lineTo(x - width / 2, y + height / 2)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}

export const renderPath = (ctx, points) => {
  ctx.beginPath()
  ctx.moveTo(points[0][0], points[0][1])
  for (let i = 1; i < points.length; ++i) {
    ctx.lineTo(points[i][0], points[i][1])
  }
  ctx.stroke()
}

