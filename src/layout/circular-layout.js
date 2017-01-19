export const circularLayout = (graph) => {
  const layout = {
    vertices: {},
    edges: {}
  }
  const r = 500
  const dtheta = Math.PI * 2 / graph.numVertices()
  const vertices = graph.vertices()
  for (let i = 0; i < vertices.length; ++i) {
    const u = vertices[i]
    layout.vertices[u] = {
      x: r * Math.cos(dtheta * i) + r,
      y: r * Math.sin(dtheta * i) + r,
      width: 20,
      height: 20
    }
    layout.edges[u] = {}
  }
  for (const [u, v] of graph.edges()) {
    layout.edges[u][v] = {
      type: 'line',
      width: 1,
      points: [
        [layout.vertices[u].x, layout.vertices[u].y],
        [layout.vertices[v].x, layout.vertices[v].y]
      ]
    }
  }
  return layout
}
