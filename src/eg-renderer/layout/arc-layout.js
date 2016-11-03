export const arcLayout = (graph) => {
  const layout = {
    vertices: {},
    edges: {}
  }
  let offset = 0
  for (const u of graph.vertices()) {
    layout.vertices[u] = {
      x: offset,
      y: 0,
      width: 20,
      height: 20
    }
    offset += 100
    layout.edges[u] = {}
  }
  for (const [u, v] of graph.edges()) {
    layout.edges[u][v] = {
      type: 'arc',
      width: 1,
      points: [
        [layout.vertices[u].x, layout.vertices[u].y],
        [layout.vertices[v].x, layout.vertices[v].y]
      ]
    }
  }
  return layout
}
