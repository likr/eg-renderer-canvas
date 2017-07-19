import {
  Graph,
  GraphAttributes,
  NodeList,
  EdgeList,
  BalloonLayout,
  CircularLayout,
  DavidsonHarelLayout,
  FastMultipoleEmbedder,
  FMMMLayout,
  PlanarizationLayout,
  TreeLayout,
  TutteLayout
} from 'emogdf'

const layoutMethods = {
  balloon: BalloonLayout,
  circular: CircularLayout,
  davidsonHarel: DavidsonHarelLayout,
  fastMultipoleEmbedder: FastMultipoleEmbedder,
  fmmm: FMMMLayout,
  planarization: PlanarizationLayout,
  tree: TreeLayout,
  tutte: TutteLayout
}

export const layout = (graphData, mode) => {
  const indexToNode = new Map()
  const graph = new Graph()
  for (const {u} of graphData.vertices) {
    indexToNode.set(u, graph.newNode())
  }
  for (const {u, v} of graphData.edges) {
    graph.newEdge(indexToNode.get(u), indexToNode.get(v))
  }

  const {
    nodeGraphics,
    edgeGraphics,
    nodeStyle,
    edgeStyle
  } = GraphAttributes
  const attributes = new GraphAttributes(graph, nodeGraphics | edgeGraphics | nodeStyle | edgeStyle)
  const nodes = new NodeList()
  graph.allNodes(nodes)
  for (const {u, width, height} of graphData.vertices) {
    const node = indexToNode.get(u)
    attributes.setWidth(node, width)
    attributes.setHeight(node, height)
  }

  const layout = new layoutMethods[mode]()
  layout.call(attributes)

  const result = {
    vertices: {},
    edges: {}
  }
  for (const {u} of graphData.vertices) {
    const node = indexToNode.get(u)
    result.vertices[u] = {
      x: attributes.x(node),
      y: attributes.y(node),
      width: attributes.width(node),
      height: attributes.height(node)
    }
    result.edges[u] = {}
  }
  const edges = new EdgeList()
  graph.allEdges(edges)
  for (const {u, v} of graphData.edges) {
    result.edges[u][v] = {
      type: 'line',
      width: 1,
      points: [
        [result.vertices[u].x, result.vertices[u].y],
        [result.vertices[v].x, result.vertices[v].y]
      ]
    }
  }
  return result
}
