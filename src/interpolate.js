import * as d3 from 'd3'

const interpolate = (current, next, r) => {
  return (next - current) * r + current
}

export const interpolateVertex = (current, next, r) => {
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

export const interpolateEdge = (current, next, r) => {
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

export const diff = (current, next) => {
  const update = {
    vertices: next.vertexIds
      .filter((u) => current.vertices.has(u))
      .map((u) => {
        return {
          current: current.vertices.get(u),
          next: next.vertices.get(u)
        }
      }),
    edges: next.edgeIds
      .filter(([u, v]) => {
        if (!current.edges.has(u) || !current.edges.get(u).has(v)) {
          return false
        }
        const nextEdge = next.edges.get(u).get(v)
        const currentEdge = current.edges.get(u).get(v)
        return nextEdge.type === currentEdge.type && nextEdge.points.length === currentEdge.points.length
      })
      .map(([u, v]) => {
        return {
          current: current.edges.get(u).get(v),
          next: next.edges.get(u).get(v)
        }
      })
  }
  const enter = {
    vertices: next.vertexIds
      .filter((u) => !current.vertices.has(u))
      .map((u) => next.vertices.get(u)),
    edges: next.edgeIds
      .filter(([u, v]) => !current.edges.has(u) || !current.edges.get(u).has(v))
      .map(([u, v]) => next.edges.get(u).get(v))
  }
  const exit = {
    vertices: current.vertexIds
      .filter((u) => !next.vertices.has(u))
      .map((u) => current.vertices.get(u)),
    edges: current.edgeIds
      .filter(([u, v]) => !next.edges.has(u) || !next.edges.get(u).has(v))
      .map(([u, v]) => current.edges.get(u).get(v))
  }
  return {update, enter, exit}
}
