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

const baseCircleMarkerPosition = (x0, y0, x1, y1, width, height, size) => {
  const r = size / 2
  const a = Math.abs((y0 - y1) / (x0 - x1))
  const theta = Math.atan(a)
  if (theta < Math.atan2(height / 2, width / 2 + r)) {
    return [
      width / 2 + r,
      Math.tan(theta) * (width / 2 + r)
    ]
  }
  if (theta > Math.atan2(height / 2 + r, width / 2)) {
    return [
      Math.tan(Math.PI / 2 - theta) * (height / 2 + r),
      height / 2 + r
    ]
  }
  const b = -1
  const c = y0 - a * x0
  const px = x0 + width / 2
  const py = y0 + height / 2
  const d = a * px + b * py + c
  const D = Math.sqrt((a ** 2 + b ** 2) * r ** 2 - d ** 2)
  return [
    (-a * d - b * D) / (a ** 2 + b ** 2) + px - x0,
    (-b * d + a * D) / (a ** 2 + b ** 2) + py - y0
  ]
}

const baseTriangleMarkerPosition = (x0, y0, x1, y1, width, height, size) => {
  const r = size * 2 / 3
  const a = Math.abs((y0 - y1) / (x0 - x1))
  const theta = Math.atan(a)
  if (theta < Math.atan2(height / 2, width / 2)) {
    return [
      width / 2 + Math.cos(theta) * r,
      Math.tan(theta) * width / 2 + Math.sin(theta) * r
    ]
  }
  return [
    Math.tan(Math.PI / 2 - theta) * height / 2 + Math.sin(Math.PI / 2 - theta) * r,
    height / 2 + Math.cos(Math.PI / 2 - theta) * r
  ]
}

const markerPosition = (x, y, x0, y0, x1, y1) => {
  if (x0 < x1) {
    if (y0 < y1) {
      return [x0 + x, y0 + y]
    } else {
      return [x0 + x, y0 - y]
    }
  } else {
    if (y0 < y1) {
      return [x0 - x, y0 + y]
    } else {
      return [x0 - x, y0 - y]
    }
  }
}

const baseFunction = (markerShape) => {
  switch (markerShape) {
    case 'circle':
      return baseCircleMarkerPosition
    case 'triangle':
      return baseTriangleMarkerPosition
  }
  return () => [0, 0]
}

export const adjustEdge = (edge, source, target) => {
  const {points, sourceMarkerShape, sourceMarkerSize, targetMarkerShape, targetMarkerSize} = edge
  const sourceBaseFunction = baseFunction(sourceMarkerShape)
  const [x0, y0] = sourceBaseFunction(source.x, source.y, target.x, target.y, source.width, source.height, sourceMarkerSize)
  points[0] = markerPosition(x0, y0, source.x, source.y, target.x, target.y)
  const targetBaseFunction = baseFunction(targetMarkerShape)
  const [x1, y1] = targetBaseFunction(target.x, target.y, source.x, source.y, target.width, target.height, targetMarkerSize)
  points[points.length - 1] = markerPosition(x1, y1, target.x, target.y, source.x, source.y)
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
  for (const vertex of graphData.vertices) {
    const {u} = vertex
    const node = indexToNode.get(u)
    result.vertices[u] = Object.assign({}, vertex, {
      x: attributes.x(node),
      y: attributes.y(node)
    })
    result.edges[u] = {}
  }
  const edges = new EdgeList()
  graph.allEdges(edges)
  for (const edge of graphData.edges) {
    const {u, v} = edge
    const source = result.vertices[u]
    const target = result.vertices[v]
    result.edges[u][v] = Object.assign({}, edge, {
      type: 'line',
      points: [
        [source.x, source.y],
        [target.x, target.y]
      ]
    })
    adjustEdge(result.edges[u][v], source, target)
  }
  return result
}
