const interpolate = (current, next, r) => {
  return (next - current) * r + current
}

const interpolateVertex = (current, next, r) => {
  const copyProperties = [
    'u',
    'type',
    'fillColor',
    'strokeColor',
    'strokeOpacity',
    'strokeWidth',
    'label',
    'labelFillColor',
    'labelStrokeColor',
    'labelStrokeWidth',
    'd'
  ]
  const interpolateProperties = [
    'x',
    'y',
    'width',
    'height'
  ]
  const result = {}
  for (const p of copyProperties) {
    result[p] = next[p]
  }
  for (const p of interpolateProperties) {
    result[p] = interpolate(current[p], next[p], r)
  }
  return result
}

const interpolateEdge = (current, next, r) => {
  const copyProperties = [
    'u',
    'v',
    'type',
    'strokeColor',
    'strokeOpacity',
    'sourceMarkerShape',
    'sourceMarkerSize',
    'targetMarkerShape',
    'targetMarkerSize',
    'label',
    'labelFillColor',
    'labelStrokeColor',
    'labelStrokeWidth',
    'd'
  ]
  const interpolateProperties = []
  const result = {}
  for (const p of copyProperties) {
    result[p] = next[p]
  }
  for (const p of interpolateProperties) {
    result[p] = interpolate(current[p], next[p], r)
  }
  result.points = current.points.map(([x, y], i) => [interpolate(x, next.points[i][0], r), interpolate(y, next.points[i][1], r)])
  return result
}

export const interpolateLayout = (current, next, r) => {
  if (r > 1) {
    return next
  }
  const vertices = Object.keys(next.vertices)
  const result = {
    vertices: {},
    edges: {}
  }
  for (const u of vertices) {
    result.vertices[u] = interpolateVertex(current.vertices[u], next.vertices[u], r)
    result.edges[u] = {}
    for (const v of vertices) {
      if (next.edges[u][v]) {
        result.edges[u][v] = interpolateEdge(current.edges[u][v], next.edges[u][v], r)
      }
    }
  }
  return result
}

const diffArcEdge = (current, next, du, dv) => {
  if (current) {
    return current
  } else if (du && dv) {
    return Object.assign({}, next, {
      points: [[du.x, du.y], [dv.x, dv.y]]
    })
  } else if (du) {
    const {x, y} = du
    const {points} = next
    return Object.assign({}, next, {
      points: [[x, y], [points[1][0], 0]]
    })
  } else if (dv) {
    const {x, y} = dv
    const {points} = next
    return Object.assign({}, next, {
      points: [[points[1][0], 0], [x, y]]
    })
  } else {
    return Object.assign({}, next, {
      points: next.points.map(([x]) => [x, 0])
    })
  }
}

const diffHierarchyEdge = (current, next, du, dv) => {
  if (current) {
    return current
  } else if (du) {
    const {x, y, width} = du
    const {points} = next
    return Object.assign({}, next, {
      points: [
        [x + width / 2, y],
        [x + width / 2, y],
        [points[2][0], 0],
        [points[3][0], 0],
        [points[4][0], 0],
        [points[5][0], 0]
      ]
    })
  } else if (dv) {
    const {x, y, width} = dv
    const {points} = next
    return Object.assign({}, next, {
      points: [
        [points[0][0], 0],
        [points[1][0], 0],
        [points[2][0], 0],
        [points[3][0], 0],
        [x - width / 2, y],
        [x - width / 2, y]
      ]
    })
  } else {
    return Object.assign({}, next, {
      points: next.points.map(([x]) => [x, 0])
    })
  }
}

export const diff = (current, next) => {
  const vertices = Object.keys(next.vertices)
  const result = {
    vertices: {},
    edges: {}
  }
  for (const u of vertices) {
    if (current.vertices[u]) {
      result.vertices[u] = current.vertices[u]
    } else {
      result.vertices[u] = Object.assign({}, next.vertices[u], {
        y: 0
      })
    }
    result.edges[u] = {}
    for (const v of vertices) {
      const nextEdge = next.edges[u][v]
      if (nextEdge) {
        const currentEdge = (current.edges[u] && current.edges[u][v] && current.edges[u][v].type === nextEdge.type) ? current.edges[u][v] : null
        const du = current.vertices[u] || null
        const dv = current.vertices[v] || null
        if (nextEdge.type === 'arc' || nextEdge.type === 'line') {
          result.edges[u][v] = diffArcEdge(currentEdge, nextEdge, du, dv)
        }
        if (next.edges[u][v].type === 'hierarchy') {
          result.edges[u][v] = diffHierarchyEdge(currentEdge, nextEdge, du, dv)
        }
      }
    }
  }
  return result
}
