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

const renderLines = (ctx, points) => {
  ctx.moveTo(points[0][0], points[0][1])
  for (let i = 1; i < points.length; ++i) {
    ctx.lineTo(points[i][0], points[i][1])
  }
}

const renderQuadraticCurve = (ctx, x1, y1, x2, y2) => {
  const dx = x2 - x1
  const dy = y2 - y1
  ctx.quadraticCurveTo(x1 + dx / 4, y1, x1 + dx / 2, y1 + dy / 2)
  ctx.quadraticCurveTo(x1 + 3 * dx / 4, y2, x2, y2)
}

const renderCurves = (ctx, points) => {
  ctx.moveTo(points[0][0], points[0][1])
  ctx.lineTo(points[1][0], points[1][1])
  renderQuadraticCurve(ctx, points[1][0], points[1][1], points[2][0], points[2][1])
  ctx.lineTo(points[3][0], points[3][1])
  renderQuadraticCurve(ctx, points[3][0], points[3][1], points[4][0], points[4][1])
  ctx.lineTo(points[5][0], points[5][1])
}

export const renderPath = (ctx, points, type) => {
  ctx.beginPath()
  switch (type) {
    case 'curve':
      renderCurves(ctx, points)
      break
    case 'line':
      renderLines(ctx, points)
      break
  }
  ctx.stroke()
}
