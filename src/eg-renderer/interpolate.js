const interpolate = (current, next, r) => {
  return r > 1 ? next : (next - current) * r + current
}

const interpolateVertex = (current, next, r) => {
  const properties = ['x', 'y', 'width', 'height']
  const result = {}
  for (const property of properties) {
    result[property] = interpolate(current[property], next[property], r)
  }
  return result
}

const interpolateEdge = (current, next, r) => {
  return {
    width: interpolate(current.width, next.width, r),
    points: current.points.map(([x, y], i) => [interpolate(x, next.points[i][0], r), interpolate(y, next.points[i][1], r)])
  }
}

export const interpolateLayout = (current, next, r) => {
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
      if (next.edges[u][v]) {
        if (current.edges[u] && current.edges[u][v]) {
          result.edges[u][v] = current.edges[u][v]
        } else if (current.vertices[u]) {
          const {x, y, width} = current.vertices[u]
          const {points} = next.edges[u][v]
          result.edges[u][v] = Object.assign({}, next.edges[u][v], {
            points: [
              [x + width / 2, y],
              [x + width / 2, y],
              [points[2][0], 0],
              [points[3][0], 0],
              [points[4][0], 0],
              [points[5][0], 0]
            ]
          })
        } else if (current.vertices[v]) {
          const {x, y, width} = current.vertices[v]
          const {points} = next.edges[u][v]
          result.edges[u][v] = Object.assign({}, next.edges[u][v], {
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
          result.edges[u][v] = Object.assign({}, next.edges[u][v], {
            points: next.edges[u][v].points.map(([x]) => [x, 0])
          })
        }
      }
    }
  }
  return result
}
