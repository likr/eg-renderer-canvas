import {
  Graph,
  GraphAttributes,
  NodeList,
  BalloonLayout,
  CircularLayout,
  DavidsonHarelLayout,
  FastMultipoleEmbedder,
  FMMMLayout,
  PlanarizationLayout,
  SugiyamaLayout,
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
  sugiyama: SugiyamaLayout,
  tree: TreeLayout,
  tutte: TutteLayout
}

export const layout = (element, graphData) => {
  const indexToNode = new Map()
  const indexToEdge = new Map()
  const graph = new Graph()
  for (const u of graphData.vertexIds) {
    indexToNode.set(u, graph.newNode())
    indexToEdge.set(u, new Map())
  }
  for (const [u, v] of graphData.edgeIds) {
    indexToEdge.get(u).set(v, graph.newEdge(indexToNode.get(u), indexToNode.get(v)))
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
  for (const u of graphData.vertexIds) {
    const {width, height} = graphData.vertices.get(u)
    const node = indexToNode.get(u)
    attributes.setWidth(node, width)
    attributes.setHeight(node, height)
  }

  const layout = new layoutMethods[element.layoutMethod]()
  switch (element.layoutMethod) {
    case 'fmmm':
      layout.unitEdgeLength = element.fmmmUnitEdgeLength
      break
  }
  layout.call(attributes)

  for (const u of graphData.vertexIds) {
    const vertex = graphData.vertices.get(u)
    const node = indexToNode.get(u)
    vertex.x = attributes.x(node)
    vertex.y = attributes.y(node)
  }
  for (const [u, v] of graphData.edgeIds) {
    const edge = graphData.edges.get(u).get(v)
    const unode = indexToNode.get(u)
    const vnode = indexToNode.get(v)
    const e = indexToEdge.get(u).get(v)
    const bends = attributes.bends(e)
    edge.points = [[attributes.x(unode), attributes.y(unode)]]
    for (let i = 0; i < bends.size(); ++i) {
      const point = bends.get(i)
      edge.points.push([point.x, point.y])
    }
    edge.points.push([attributes.x(vnode), attributes.y(vnode)])
  }
}
