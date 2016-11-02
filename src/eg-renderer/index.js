import 'babel-polyfill'
import * as d3 from 'd3'
import Graph from 'egraph/graph'
import Layouter from 'egraph/layouter/sugiyama'
import {
  centerTransform,
  layoutRect
} from './centering'
import {
  diff,
  interpolateLayout
} from './interpolate'
import {
  renderPath,
  renderRect
} from './render'

const withContext = (ctx, f) => {
  ctx.save()
  f()
  ctx.restore()
}

const privates = new WeakMap()

class EgRenderer extends window.HTMLElement {
  createdCallback () {
    const p = {
      canvas: document.createElement('canvas'),
      transform: {
        x: 0,
        y: 0,
        k: 1
      },
      highlightedVertex: null,
      graph: new Graph(),
      layoutResult: {
        vertices: {},
        edges: {}
      },
      margin: 10,
      transitionDuration: 500,
      zoom: d3.zoom().on('zoom', () => {
        Object.assign(privates.get(this).transform, d3.event.transform)
      }),
      layoutTime: 0,
      layouter: new Layouter(),
      edgeType: 'curve'
    }
    privates.set(this, p)

    this.createShadowRoot().appendChild(p.canvas)

    d3.select(p.canvas)
      .call(p.zoom)

    p.canvas.addEventListener('mousemove', (event) => {
      if (event.region == null) {
        p.canvas.style.cursor = 'move'
        p.highlightedVertex = null
      } else {
        p.canvas.style.cursor = 'pointer'
        p.highlightedVertex = event.region
      }
    })

    const render = () => {
      const now = new Date()
      const r = (now - p.layoutTime) / p.transitionDuration
      const layout = interpolateLayout(p.previousLayoutResult, p.layoutResult, r)
      const ctx = p.canvas.getContext('2d')
      ctx.resetTransform()
      ctx.clearRect(0, 0, p.canvas.width, p.canvas.height)
      ctx.translate(p.transform.x, p.transform.y)
      ctx.scale(p.transform.k, p.transform.k)
      ctx.translate(p.margin, p.margin)
      for (const u of p.graph.vertices()) {
        const {x, y, width, height} = layout.vertices[u]
        const {text} = p.graph.vertex(u)
        withContext(ctx, () => {
          ctx.translate(x, y)
          ctx.textAlign = 'center'
          withContext(ctx, () => {
            ctx.fillStyle = u.toString() === p.highlightedVertex ? 'red' : 'white'
            renderRect(ctx, 0, 0, width, height)
          })
          if (ctx.addHitRegion) {
            ctx.addHitRegion({id: u})
          }
          ctx.fillText(text, 0, 4)
        })
      }
      for (const [u, v] of p.graph.edges()) {
        const {points} = layout.edges[u][v]
        renderPath(ctx, points, p.edgeType)
      }
      window.requestAnimationFrame(render)
    }
    render()
  }

  layout () {
    const p = privates.get(this)
    const {graph, layouter} = p
    const layoutResult = layouter.layout(graph)
    for (const [u, v] of graph.edges()) {
      const {points} = layoutResult.edges[u][v]
      while (points.length < 6) {
        points.push(points[points.length - 1])
      }
    }
    p.previousLayoutResult = diff(p.layoutResult, layoutResult)
    p.layoutResult = layoutResult
    p.layoutTime = new Date()
    return this
  }

  resize (width, height) {
    const {canvas} = privates.get(this)
    canvas.width = width
    canvas.height = height
    return this
  }

  center () {
    const {canvas, layoutResult, margin, zoom} = privates.get(this)
    const {layoutWidth, layoutHeight} = layoutRect(layoutResult)
    const {x, y, k} = centerTransform(layoutWidth, layoutHeight, canvas.width, canvas.height, margin)
    zoom.transform(d3.select(canvas), d3.zoomIdentity.translate(x, y).scale(k))
  }

  graph () {
    return privates.get(this).graph
  }

  layouter () {
    return privates.get(this).layouter
  }

  transitionDuration () {
    if (arguments.length === 0) {
      return privates.get(this).transitionDuration
    } else {
      privates.get(this).transitionDuration = arguments[0]
      return this
    }
  }

  edgeType () {
    if (arguments.length === 0) {
      return privates.get(this).edgeType
    } else {
      privates.get(this).edgeType = arguments[0]
      return this
    }
  }
}

document.registerElement('eg-renderer', EgRenderer)
