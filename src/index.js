import 'babel-polyfill'
import * as d3 from 'd3'
import Graph from 'egraph/graph'
import Layouter from 'egraph/layouter/sugiyama'
import {arcLayout} from './layout/arc-layout'
import {circularLayout} from './layout/circular-layout'
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

const renderType = (layout) => {
  switch (layout) {
    case 'arc':
      return ['circle', 'arc']
    case 'circular':
      return ['circle', 'line']
    case 'hierarchy':
      return ['rect', 'curve']
  }
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
      zoom: d3.zoom().on('zoom', () => {
        Object.assign(privates.get(this).transform, d3.event.transform)
      }),
      layoutTime: 0
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
      for (const vertex of data.vertices) {
        const u = vertex.u
        renderVertex(ctx, Object.assign({}, layout.vertices[u], {
          u,
          text: vertex.d.text,
          fillColor: u.toString() === p.highlightedVertex ? 'red' : 'white'
        }))
      }
      for (const vertex of data.vertices) {
        const u = vertex.u
        for (const v in layout.edges[u]) {
          if (layout.edges[u][v]) {
            renderEdge(ctx, layout.edges[u][v])
          }
        }
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

    let layoutResult
    switch (mode) {
      case 'arc':
        layoutResult = arcLayout(graph)
        break
      case 'circular':
        layoutResult = circularLayout(graph)
        break
      case 'hierarchy':
        const layouter = new Layouter()
          .vertexWidth(() => 150)
          .vertexHeight(() => 20)
          .layerMargin(50)
          .vertexMargin(30)
        layoutResult = layouter.layout(graph)
        for (const [u, v] of graph.edges()) {
          const {points} = layoutResult.edges[u][v]
          while (points.length < 6) {
            points.push(points[points.length - 1])
          }
          layoutResult.edges[u][v].type = 'hierarchy'
        }
        break
    }
    const [vertexType] = renderType(this.getAttribute('layout'))
    for (const u of graph.vertices()) {
      layoutResult.vertices[u].type = vertexType
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
    const {layoutWidth, layoutHeight} = layoutRect(layoutResult)
    const {x, y, k} = centerTransform(layoutWidth, layoutHeight, canvas.width, canvas.height, margin)
    zoom.transform(d3.select(canvas), d3.zoomIdentity.translate(x, y).scale(k))
  }
}

document.registerElement('eg-renderer', EgRenderer)
