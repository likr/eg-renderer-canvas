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
  return {
    vertices: next.vertices.map((vertex) => {
      const {u} = vertex
      return interpolateVertex(current.vertices.get(u), vertex, r)
    }),
    edges: next.edges.map((edge) => {
      const {u, v} = edge
      return interpolateEdge(current.edges.get(u).get(v), edge, r)
    })
  }
}

const diffEdge = (current, next, du, dv) => {
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

const getCurrentEdge = (nextEdge, currentEdges) => {
  const {u, v} = nextEdge
  if (!currentEdges.has(u)) {
    return null
  }
  const vs = currentEdges.get(u)
  if (!vs.has(v)) {
    return null
  }
  const e = vs.get(v)
  return e.type === nextEdge.type ? e : null
}

export const diff = (current, next) => {
  const diffedEdges = new Map(next.vertices.map(({u}) => [u, new Map()]))
  for (const edge of next.edges) {
    const {u, v} = edge
    const du = current.vertices.has(u) ? current.vertices.get(u) : null
    const dv = current.vertices.has(v) ? current.vertices.get(u) : null
    const currentEdge = getCurrentEdge(edge, current.edges)
    if (edge.type === 'hierarchy') {
      diffedEdges.get(u).set(v, diffHierarchyEdge(currentEdge, edge, du, dv))
    }
    diffedEdges.get(u).set(v, diffEdge(currentEdge, edge, du, dv))
  }

  return {
    vertices: new Map(next.vertices.map((vertex) => {
      const {u} = vertex
      if (current.vertices.has(u)) {
        return [u, current.vertices.get(u)]
      }
      return [u, Object.assign({}, vertex, {
        y: 0
      })]
    })),
    edges: diffedEdges
  }
}

export const makeMap = (data) => {
  const vertices = new Map(data.vertices.map((vertex) => [vertex.u, vertex]))
  const edges = new Map(data.vertices.map(({u}) => [u, new Map()]))
  for (const edge of data.edges) {
    const {u, v} = edge
    edges.get(u).set(v, edge)
  }
  return {vertices, edges}
}
