const withContext = (ctx, f) => {
  ctx.save()
  f()
  ctx.restore()
}

const renderRectVertex = (ctx, args) => {
  const {
    u,
    x,
    y,
    width,
    height,
    text,
    fillColor
  } = args
  withContext(ctx, () => {
    ctx.translate(x, y)
    withContext(ctx, () => {
      ctx.fillStyle = fillColor
      ctx.beginPath()
      ctx.moveTo(-width / 2, -height / 2)
      ctx.lineTo(width / 2, -height / 2)
      ctx.lineTo(width / 2, height / 2)
      ctx.lineTo(-width / 2, height / 2)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    })
    if (ctx.addHitRegion) {
      ctx.addHitRegion({id: u})
    }
    ctx.textAlign = 'center'
    ctx.fillText(text, 0, 4)
  })
}

const renderCircleVertex = (ctx, args) => {
  const {
    u,
    x,
    y,
    width,
    height,
    text,
    fillColor
  } = args
  withContext(ctx, () => {
    ctx.translate(x, y)
    withContext(ctx, () => {
      ctx.fillStyle = fillColor
      ctx.beginPath()
      ctx.scale(1, height / width)
      ctx.arc(0, 0, width / 2, 0, 2 * Math.PI)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    })
    if (ctx.addHitRegion) {
      ctx.addHitRegion({id: u})
    }
    ctx.textAlign = 'center'
    ctx.fillText(text, 0, 4)
  })
}

export const renderVertex = (ctx, args, type) => {
  switch (type) {
    case 'circle':
      renderCircleVertex(ctx, args)
      break
    case 'rect':
      renderRectVertex(ctx, args)
      break
  }
}

const renderLineEdge = (ctx, points) => {
  ctx.beginPath()
  ctx.moveTo(points[0][0], points[0][1])
  for (let i = 1; i < points.length; ++i) {
    ctx.lineTo(points[i][0], points[i][1])
  }
  ctx.stroke()
}

const renderQuadraticCurve = (ctx, x1, y1, x2, y2) => {
  const dx = x2 - x1
  const dy = y2 - y1
  ctx.quadraticCurveTo(x1 + dx / 4, y1, x1 + dx / 2, y1 + dy / 2)
  ctx.quadraticCurveTo(x1 + 3 * dx / 4, y2, x2, y2)
}

const renderCurveEdge = (ctx, points) => {
  ctx.beginPath()
  ctx.moveTo(points[0][0], points[0][1])
  ctx.lineTo(points[1][0], points[1][1])
  renderQuadraticCurve(ctx, points[1][0], points[1][1], points[2][0], points[2][1])
  ctx.lineTo(points[3][0], points[3][1])
  renderQuadraticCurve(ctx, points[3][0], points[3][1], points[4][0], points[4][1])
  ctx.lineTo(points[5][0], points[5][1])
  ctx.stroke()
}

export const renderEdge = (ctx, points, type) => {
  switch (type) {
    case 'curve':
      renderCurveEdge(ctx, points)
      break
    case 'line':
      renderLineEdge(ctx, points)
      break
  }
}
