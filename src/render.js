const withContext = (ctx, f) => {
  ctx.save()
  f()
  ctx.restore()
}

const setVertexStyles = (ctx, args) => {
  const {
    fillColor,
    strokeColor,
    strokeWidth
  } = args
  ctx.fillStyle = fillColor.toString()
  ctx.strokeStyle = strokeColor.toString()
  ctx.lineWidth = strokeWidth
}

const setEdgeStyles = (ctx, args) => {
  const {
    strokeColor,
    strokeWidth
  } = args
  ctx.strokeStyle = strokeColor.toString()
  ctx.lineWidth = strokeWidth
}

const setLabelStyles = (ctx, args) => {
  const {
    labelFillColor,
    labelStrokeColor,
    labelStrokeWidth,
    labelFontSize,
    labelFontFamily
  } = args
  ctx.fillStyle = labelFillColor.toString()
  ctx.strokeStyle = labelStrokeColor.toString()
  ctx.lineWidth = labelStrokeWidth
  ctx.font = `${labelFontSize}px ${labelFontFamily}`
}

const renderRectVertex = (ctx, width, height) => {
  ctx.moveTo(-width / 2, -height / 2)
  ctx.lineTo(width / 2, -height / 2)
  ctx.lineTo(width / 2, height / 2)
  ctx.lineTo(-width / 2, height / 2)
  ctx.closePath()
}

const renderCircleVertex = (ctx, width, height) => {
  ctx.ellipse(0, 0, width / 2, height / 2, 0, 0, 2 * Math.PI)
}

export const renderVertex = (ctx, args) => {
  const {
    type,
    u,
    x,
    y,
    width,
    height,
    strokeWidth
  } = args
  withContext(ctx, () => {
    ctx.translate(x, y)
    withContext(ctx, () => {
      setVertexStyles(ctx, args)
      ctx.beginPath()
      switch (type) {
        case 'circle':
          renderCircleVertex(ctx, width, height)
          break
        case 'rect':
          renderRectVertex(ctx, width, height)
          break
        default:
          return
      }
      ctx.closePath()
      ctx.fill()
      if (strokeWidth > 0) {
        ctx.stroke()
      }
    })
    if (ctx.addHitRegion) {
      ctx.addHitRegion({id: u})
    }
  })
}

export const renderVertexLabel = (ctx, args) => {
  const {
    x,
    y,
    label
  } = args
  if (!label) {
    return
  }
  withContext(ctx, () => {
    setLabelStyles(ctx, args)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    if (args.labelStrokeWidth > 0) {
      ctx.strokeText(label, x, y)
    }
    ctx.fillText(label, x, y)
  })
}

const renderLineEdge = (ctx, points) => {
  ctx.moveTo(points[0][0], points[0][1])
  for (let i = 1; i < points.length; ++i) {
    ctx.lineTo(points[i][0], points[i][1])
  }
}

const renderQuadraticCurveEdge = (ctx, points) => {
  const n = points.length
  ctx.moveTo(points[0][0], points[0][1])
  if (n === 2) {
    ctx.lineTo(points[1][0], points[1][1])
    return
  }
  for (let i = 2; i < n - 1; ++i) {
    const [x1, y1] = points[i - 1]
    const [x2, y2] = points[i]
    const dx = (x2 - x1) / 2
    const dy = (y2 - y1) / 2
    ctx.quadraticCurveTo(x1, y1, x1 + dx, y1 + dy)
  }
  ctx.quadraticCurveTo(points[n - 2][0], points[n - 2][1], points[n - 1][0], points[n - 1][1])
}

const renderArcEdge = (ctx, points) => {
  const dx = points[1][0] - points[0][0]
  const dy = points[1][1] - points[0][1]
  const r = Math.sqrt(dx * dx + dy * dy) / 2
  const cx = (points[0][0] + points[1][0]) / 2
  const cy = (points[0][1] + points[1][1]) / 2
  const theta = Math.atan2(dy, dx)
  ctx.arc(cx, cy, r, theta, theta + Math.PI)
}

export const renderEdge = (ctx, args) => {
  const {
    type,
    points,
    sourceMarkerShape,
    sourceMarkerSize,
    targetMarkerShape,
    targetMarkerSize
  } = args
  withContext(ctx, () => {
    withContext(ctx, () => {
      setEdgeStyles(ctx, args)
      ctx.beginPath()
      switch (type) {
        case 'arc':
          renderArcEdge(ctx, points)
          break
        case 'quadratic':
          renderQuadraticCurveEdge(ctx, points)
          break
        case 'line':
          renderLineEdge(ctx, points)
          break
      }
      ctx.stroke()
    })

    switch (sourceMarkerShape) {
      case 'circle':
        withContext(ctx, () => {
          const [x, y] = points[0]
          const r = sourceMarkerSize / 2
          ctx.fillStyle = args.strokeColor.toString()
          ctx.translate(x, y)
          ctx.beginPath()
          ctx.ellipse(0, 0, r, r, 0, 0, 2 * Math.PI)
          ctx.fill()
        })
        break
      case 'triangle':
        withContext(ctx, () => {
          const [x, y] = points[0]
          const [x0, y0] = points[1]
          const theta = Math.atan2(y - y0, x - x0)
          const r = targetMarkerSize * 2 / 3
          ctx.fillStyle = args.strokeColor.toString()
          ctx.beginPath()
          ctx.moveTo(x + Math.cos(theta) * r, y + Math.sin(theta) * r)
          ctx.lineTo(x + Math.cos(theta + Math.PI * 2 / 3) * r, y + Math.sin(theta + Math.PI * 2 / 3) * r)
          ctx.lineTo(x + Math.cos(theta + Math.PI * 4 / 3) * r, y + Math.sin(theta + Math.PI * 4 / 3) * r)
          ctx.closePath()
          ctx.fill()
        })
        break
    }

    switch (targetMarkerShape) {
      case 'circle':
        withContext(ctx, () => {
          const [x, y] = points[points.length - 1]
          const r = targetMarkerSize / 2
          ctx.fillStyle = args.strokeColor.toString()
          ctx.translate(x, y)
          ctx.beginPath()
          ctx.ellipse(0, 0, r, r, 0, 0, 2 * Math.PI)
          ctx.fill()
        })
        break
      case 'triangle':
        withContext(ctx, () => {
          const [x, y] = points[points.length - 1]
          const [x0, y0] = points[points.length - 2]
          const theta = Math.atan2(y - y0, x - x0)
          const r = targetMarkerSize * 2 / 3
          ctx.fillStyle = args.strokeColor.toString()
          ctx.beginPath()
          ctx.moveTo(x + Math.cos(theta) * r, y + Math.sin(theta) * r)
          ctx.lineTo(x + Math.cos(theta + Math.PI * 2 / 3) * r, y + Math.sin(theta + Math.PI * 2 / 3) * r)
          ctx.lineTo(x + Math.cos(theta + Math.PI * 4 / 3) * r, y + Math.sin(theta + Math.PI * 4 / 3) * r)
          ctx.closePath()
          ctx.fill()
        })
        break
    }
  })
}

export const renderEdgeLabel = (ctx, args) => {
  const {
    points,
    label
  } = args
  if (!label) {
    return
  }
  withContext(ctx, () => {
    const x = (points[0][0] + points[points.length - 1][0]) / 2
    const y = (points[0][1] + points[points.length - 1][1]) / 2
    setLabelStyles(ctx, args)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    if (args.labelStrokeWidth > 0) {
      ctx.strokeText(label, x, y)
    }
    ctx.fillText(label, x, y)
  })
}
