import * as d3 from 'd3'

const interpolate = (current, next, r) => {
  return (next - current) * r + current
}

const interpolateVertex = (current, next, r) => {
  const copyProperties = [
    'u',
    'type',
    'label',
    'd'
  ]
  const interpolateProperties = [
    'x',
    'y',
    'width',
    'height',
    'strokeWidth',
    'labelStrokeWidth',
    'alpha'
  ]
  const colorInterpolateProperties = [
    'fillColor',
    'strokeColor',
    'labelFillColor',
    'labelStrokeColor'
  ]
  const result = {}
  for (const p of copyProperties) {
    result[p] = next[p]
  }
  for (const p of interpolateProperties) {
    result[p] = interpolate(current[p], next[p], r)
  }
  for (const p of colorInterpolateProperties) {
    result[p] = d3.interpolateRgb(current[p], next[p])(r)
  }
  return result
}

const interpolateEdge = (current, next, r) => {
  const copyProperties = [
    'u',
    'v',
    'type',
    'sourceMarkerShape',
    'targetMarkerShape',
    'label',
    'd'
  ]
  const interpolateProperties = [
    'strokeWidth',
    'sourceMarkerSize',
    'targetMarkerSize',
    'labelStrokeWidth',
    'alpha'
  ]
  const colorInterpolateProperties = [
    'strokeColor',
    'labelFillColor',
    'labelStrokeColor'
  ]
  const result = {}
  for (const p of copyProperties) {
    result[p] = next[p]
  }
  for (const p of interpolateProperties) {
    result[p] = interpolate(current[p], next[p], r)
  }
  for (const p of colorInterpolateProperties) {
    result[p] = d3.interpolateRgb(current[p], next[p])(r)
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

const diffEdgePoints = (current, next, du, dv) => {
  if (current) {
    return current.points
  } else if (du && dv) {
    return [[du.x, du.y], [dv.x, dv.y]]
  } else if (du) {
    const {x, y} = du
    return [[x, y], next.points[1]]
  } else if (dv) {
    const {x, y} = dv
    return [next.points[0], [x, y]]
  } else {
    return next.points
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
    const dv = current.vertices.has(v) ? current.vertices.get(v) : null
    const currentEdge = getCurrentEdge(edge, current.edges)
    diffedEdges.get(u).set(v, Object.assign({}, edge, {
      points: diffEdgePoints(currentEdge, edge, du, dv),
      alpha: currentEdge ? 1 : 0
    }))
  }

  return {
    vertices: new Map(next.vertices.map((vertex) => {
      const {u} = vertex
      if (current.vertices.has(u)) {
        return [u, current.vertices.get(u)]
      }
      return [u, Object.assign({}, vertex, {
        alpha: 0
      })]
    })),
    edges: diffedEdges
  }
}

export const makeMap = (data) => {
  const vertices = new Map(data.vertices.map((vertex) => [vertex.u, Object.assign({}, vertex)]))
  const edges = new Map(data.vertices.map(({u}) => [u, new Map()]))
  for (const edge of data.edges) {
    const {u, v} = edge
    edges.get(u).set(v, Object.assign({}, edge))
  }
  return {vertices, edges}
}
