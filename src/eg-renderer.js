import 'babel-polyfill'
import Graph from 'egraph/graph'
import Layouter from 'egraph/layouter/sugiyama'

const renderRect = (ctx, x, y, width, height) => {
  ctx.beginPath()
  ctx.moveTo(x - width / 2, y - height / 2)
  ctx.lineTo(x + width / 2, y - height / 2)
  ctx.lineTo(x + width / 2, y + height / 2)
  ctx.lineTo(x - width / 2, y + height / 2)
  ctx.closePath()
  ctx.stroke()
}

const renderPath = (ctx, points) => {
  ctx.beginPath()
  ctx.moveTo(points[0][0], points[0][1])
  for (let i = 1; i < points.length; ++i) {
    ctx.lineTo(points[i][0], points[i][1])
  }
  ctx.stroke()
}

const withTransform = (ctx, f) => {
  ctx.save()
  f()
  ctx.restore()
}

const layoutRect = ({vertices}) => {
  const keys = Object.keys(vertices)
  const left = Math.min(...keys.map((u) => vertices[u].x - vertices[u].width / 2))
  const right = Math.max(...keys.map((u) => vertices[u].x + vertices[u].width / 2))
  const top = Math.min(...keys.map((u) => vertices[u].y - vertices[u].height / 2))
  const bottom = Math.max(...keys.map((u) => vertices[u].y + vertices[u].height / 2))
  return {
    layoutWidth: right - left,
    layoutHeight: bottom - top
  }
}

const centerTransform = (lWidth, lHeight, cWidth, cHeight, margin) => {
  const aWidth = cWidth - 2 * margin
  const aHeight = cHeight - 2 * margin
  const hScale = aWidth / lWidth
  const vScale = aHeight / lHeight
  const scale = Math.min(hScale, vScale)
  const x = hScale < vScale ? 0 : (aWidth - lWidth * scale) / 2
  const y = vScale < hScale ? 0 : (aHeight - lHeight * scale) / 2
  return {scale, x, y}
}

class EgRenderer extends window.HTMLElement {
  createdCallback () {
    const canvas = document.createElement('canvas')
    this.canvas = canvas
    this.createShadowRoot().appendChild(canvas)
  }

  render (graphData) {
    const graph = new Graph()
    for (const {u, d} of graphData.vertices) {
      graph.addVertex(u, d)
    }
    for (const {u, v, d} of graphData.edges) {
      graph.addEdge(u, v, d)
    }
    const layouter = new Layouter()
      .vertexWidth(() => 140)
      .vertexHeight(() => 20)
      .layerMargin(50)
      .vertexMargin(30)
    const layout = layouter.layout(graph)
    const margin = 10
    const {layoutWidth, layoutHeight} = layoutRect(layout)
    const canvasWidth = this.canvas.width
    const canvasHeight = this.canvas.height
    const {scale, x, y} = centerTransform(layoutWidth, layoutHeight, canvasWidth, canvasHeight, margin)
    const ctx = this.canvas.getContext('2d')
    ctx.translate(margin, margin)
    ctx.translate(x, y)
    ctx.scale(scale, scale)
    for (const u of graph.vertices()) {
      const {x, y, width, height} = layout.vertices[u]
      const {text} = graph.vertex(u)
      withTransform(ctx, () => {
        ctx.translate(x, y)
        ctx.textAlign = 'center'
        ctx.fillText(text, 0, 4)
        renderRect(ctx, 0, 0, width, height)
      })
    }
    for (const [u, v] of graph.edges()) {
      const {points} = layout.edges[u][v]
      renderPath(ctx, points)
    }
  }
}

document.registerElement('eg-renderer', EgRenderer)
