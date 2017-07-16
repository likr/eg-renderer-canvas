import 'babel-polyfill'
import * as d3 from 'd3'
import Graph from 'egraph/graph'
import {layout} from './layout'
import {
  centerTransform,
  layoutRect
} from './centering'
import {
  diff,
  interpolateLayout
} from './interpolate'
import {
  renderEdge,
  renderVertex
} from './render'

const zoom = (attrs) => {
  const pos = {
    region: null,
    x0: 0,
    y0: 0
  }
  const zoom = d3.zoom()
  zoom
    .on('start', () => {
      if (d3.event.sourceEvent && d3.event.sourceEvent.region) {
        pos.region = d3.event.sourceEvent.region
        pos.x0 = d3.event.transform.x / d3.event.transform.k
        pos.y0 = d3.event.transform.y / d3.event.transform.k
      }
    })
    .on('zoom', () => {
      if (pos.region) {
        const dx = d3.event.transform.x / d3.event.transform.k - pos.x0
        const dy = d3.event.transform.y / d3.event.transform.k - pos.y0
        attrs.layoutResult.vertices[pos.region].x += dx
        attrs.layoutResult.vertices[pos.region].y += dy
        for (const key in attrs.layoutResult.edges) {
          if (attrs.layoutResult.edges[key][pos.region]) {
            const {points} = attrs.layoutResult.edges[key][pos.region]
            points[points.length - 1][0] += dx
            points[points.length - 1][1] += dy
          }
        }
        for (const key in attrs.layoutResult.edges[pos.region]) {
          const {points} = attrs.layoutResult.edges[pos.region][key]
          points[0][0] += dx
          points[0][1] += dy
        }
        pos.x0 = d3.event.transform.x / d3.event.transform.k
        pos.y0 = d3.event.transform.y / d3.event.transform.k
      } else {
        Object.assign(attrs.transform, d3.event.transform)
      }
    })
    .on('end', function () {
      if (pos.region) {
        pos.region = null
        d3.select(this)
          .call(zoom.transform, d3.zoomIdentity.translate(attrs.transform.x, attrs.transform.y).scale(attrs.transform.k))
      }
    })
  return zoom
}

const privates = new WeakMap()

class EgRenderer extends window.HTMLElement {
  static get observedAttributes () {
    return [
      'data',
      'layout',
      'width',
      'height'
    ]
  }

  createdCallback () {
    const p = {
      canvas: document.createElement('canvas'),
      data: {
        vertices: [],
        edges: []
      },
      transform: {
        x: 0,
        y: 0,
        k: 1
      },
      highlightedVertex: null,
      layoutResult: {
        vertices: {},
        edges: {}
      },
      margin: 10,
      layoutTime: 0
    }
    p.zoom = zoom(p)
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
      const transitionDuration = this.getAttribute('transition-duration')
      const r = (now - p.layoutTime) / transitionDuration
      const layout = interpolateLayout(p.previousLayoutResult, p.layoutResult, r)
      const ctx = p.canvas.getContext('2d')
      ctx.save()
      ctx.clearRect(0, 0, p.canvas.width, p.canvas.height)
      ctx.translate(p.transform.x, p.transform.y)
      ctx.scale(p.transform.k, p.transform.k)
      ctx.translate(p.margin, p.margin)
      const data = p.data
      const textKey = this.getAttribute('text-key') || 'text'
      for (const vertex of data.vertices) {
        const u = vertex.u
        for (const v in layout.edges[u]) {
          if (layout.edges[u][v]) {
            renderEdge(ctx, layout.edges[u][v])
          }
        }
      }
      for (const vertex of data.vertices) {
        const u = vertex.u
        renderVertex(ctx, Object.assign({}, layout.vertices[u], {
          u,
          text: vertex.d[textKey] || '',
          fillColor: u.toString() === p.highlightedVertex ? 'red' : 'white'
        }))
      }
      ctx.restore()
      window.requestAnimationFrame(render)
    }
    render()

    if (this.hasAttribute('width')) {
      p.canvas.width = this.getAttribute('width')
    }
    if (this.hasAttribute('height')) {
      p.canvas.height = this.getAttribute('height')
    }
    if (this.hasAttribute('data')) {
      p.data = JSON.parse(this.getAttribute('data'))
      this.layout()
      this.center()
    }
  }

  attributeChangedCallback (attr, oldValue, newValue) {
    const p = privates.get(this)
    const {canvas} = p
    switch (attr) {
      case 'data':
        p.data = JSON.parse(newValue)
        if (this.hasAttribute('auto-update')) {
          this.layout()
        }
        break
      case 'layout':
        if (this.hasAttribute('auto-update')) {
          this.layout()
        }
        break
      case 'width':
        canvas.width = newValue
        break
      case 'height':
        canvas.height = newValue
        break
    }
  }

  layout () {
    const p = privates.get(this)
    const {data} = p
    const mode = this.getAttribute('layout')
    const graph = new Graph()
    for (const {u, d} of data.vertices) {
      graph.addVertex(u, d)
    }
    for (const {u, v, d} of data.edges) {
      graph.addEdge(u, v, d)
    }

    let layoutResult = layout(data, mode)
    for (const u of graph.vertices()) {
      layoutResult.vertices[u].type = 'circle'
    }
    p.previousLayoutResult = diff(p.layoutResult, layoutResult)
    p.layoutResult = layoutResult
    p.layoutTime = new Date()
    if (this.hasAttribute('auto-centering')) {
      this.center()
    }
    return this
  }

  center () {
    const {canvas, layoutResult, margin, zoom} = privates.get(this)
    const {layoutWidth, layoutHeight, left, top} = layoutRect(layoutResult)
    const {x, y, k} = centerTransform(layoutWidth, layoutHeight, left, top, canvas.width, canvas.height, margin)
    zoom.transform(d3.select(canvas), d3.zoomIdentity.translate(x, y).scale(k))
  }
}

document.registerElement('eg-renderer', EgRenderer)
