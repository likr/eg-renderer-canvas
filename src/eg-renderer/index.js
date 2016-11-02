import 'babel-polyfill'
import * as d3 from 'd3'
import Graph from 'egraph/graph'
import Layouter from 'egraph/layouter/sugiyama'
import {
  renderRect,
  renderPath
} from './render'
import {
  interpolateLayout,
  diff
} from './interpolate'

const withContext = (ctx, f) => {
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
  return {x, y, k: scale}
}

class EgRenderer extends window.HTMLElement {
  createdCallback () {
    const canvas = document.createElement('canvas')
    this.canvas = canvas
    this.createShadowRoot().appendChild(canvas)
    this.transform = {
      x: 0,
      y: 0,
      k: 1
    }
    this.highlightedVertex = null
    this.graph = new Graph()
    this.layoutResult = {vertices: {}, edges: {}}
    this.margin = 10

    this.zoom = d3.zoom()
      .on('zoom', () => {
        Object.assign(this.transform, d3.event.transform)
      })
    d3.select(this.canvas)
      .call(this.zoom)

    this.canvas.addEventListener('mousemove', (event) => {
      if (event.region == null) {
        this.canvas.style.cursor = 'move'
        this.highlightedVertex = null
      } else {
        this.canvas.style.cursor = 'pointer'
        this.highlightedVertex = event.region
      }
    })

    const render = () => {
      const now = new Date()
      const r = (now - this.layoutTime) / 500
      const layout = interpolateLayout(this.previousLayoutResult, this.layoutResult, r)
      const ctx = this.canvas.getContext('2d')
      ctx.resetTransform()
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      ctx.translate(this.transform.x, this.transform.y)
      ctx.scale(this.transform.k, this.transform.k)
      ctx.translate(this.margin, this.margin)
      for (const u of this.graph.vertices()) {
        const {x, y, width, height} = layout.vertices[u]
        const {text} = this.graph.vertex(u)
        withContext(ctx, () => {
          ctx.translate(x, y)
          ctx.textAlign = 'center'
          withContext(ctx, () => {
            ctx.fillStyle = u.toString() === this.highlightedVertex ? 'red' : 'white'
            renderRect(ctx, 0, 0, width, height)
          })
          if (ctx.addHitRegion) {
            ctx.addHitRegion({id: u})
          }
          ctx.fillText(text, 0, 4)
        })
      }
      for (const [u, v] of this.graph.edges()) {
        const {points} = layout.edges[u][v]
        renderPath(ctx, points)
      }
      window.requestAnimationFrame(render)
    }
    render()
  }

  layout () {
    const layouter = new Layouter()
      .vertexWidth(() => 150)
      .vertexHeight(() => 20)
      .layerMargin(50)
      .vertexMargin(30)
    const layoutResult = layouter.layout(this.graph)
    for (const [u, v] of this.graph.edges()) {
      const {points} = layoutResult.edges[u][v]
      while (points.length < 6) {
        points.push(points[points.length - 1])
      }
    }
    this.previousLayoutResult = diff(this.layoutResult, layoutResult)
    this.layoutResult = layoutResult
    this.layoutTime = new Date()
    return this
  }

  resize (width, height) {
    this.canvas.width = width
    this.canvas.height = height
    return this
  }

  center () {
    const {layoutWidth, layoutHeight} = layoutRect(this.layoutResult)
    const {x, y, k} = centerTransform(layoutWidth, layoutHeight, this.canvas.width, this.canvas.height, this.margin)
    this.zoom.transform(d3.select(this.canvas), d3.zoomIdentity.translate(x, y).scale(k))
  }
}

document.registerElement('eg-renderer', EgRenderer)
