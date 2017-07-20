import 'babel-polyfill'
import * as d3 from 'd3'
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
import {zoom} from './zoom'

const devicePixelRatio = () => {
  return window.devicePixelRatio || 1.0
}

const get = (d, key, defaultValue) => {
  return d.hasOwnProperty(key) ? d[key] : defaultValue
}

const loadData = (e, jsonString) => {
  const data = JSON.parse(jsonString)
  const nodeLabelProperty = e.getAttribute('node-label-property') || 'label'
  const nodeWidthProperty = e.getAttribute('node-width-property') || 'width'
  const nodeHeightProperty = e.getAttribute('node-height-property') || 'height'
  const nodeFillColorProperty = e.getAttribute('node-fill-color-property') || 'fill'
  const nodeStrokeColorProperty = e.getAttribute('node-stroke-color-property') || 'stroke'
  const nodeTypeProperty = e.getAttribute('node-type-property') || 'type'
  const defaultNodeLabel = e.getAttribute('default-node-label') || ''
  const defaultNodeWidth = e.getAttribute('default-node-width') || 10
  const defaultNodeHeight = e.getAttribute('default-node-height') || 10
  const defaultNodeFillColor = e.getAttribute('default-node-fill-color') || '#fff'
  const defaultNodeStrokeColor = e.getAttribute('default-node-stroke-color') || '#000'
  const defaultNodeType = e.getAttribute('default-node-type') || 'rect'
  for (const node of data.vertices) {
    const {d} = node
    Object.assign(node, {
      label: get(d, nodeLabelProperty, defaultNodeLabel),
      width: +get(d, nodeWidthProperty, defaultNodeWidth),
      height: +get(d, nodeHeightProperty, defaultNodeHeight),
      type: get(d, nodeTypeProperty, defaultNodeType),
      fillColor: get(d, nodeFillColorProperty, defaultNodeFillColor),
      strokeColor: get(d, nodeStrokeColorProperty, defaultNodeStrokeColor)

    })
  }
  return data
}

const privates = new WeakMap()

const setWidth = (e, width) => {
  const p = privates.get(e)
  p.canvas.width = width * devicePixelRatio()
  p.canvas.style.width = `${width}px`
}

const setHeight = (e, height) => {
  const p = privates.get(e)
  p.canvas.height = height * devicePixelRatio()
  p.canvas.style.height = `${height}px`
}

/**
 * definition of the <eg-renderer> custom element
 *
 * Attributes
 * * data
 * * layout-method
 * * width
 * * height
 * * transition-duration
 * * node-label-property
 * * node-width-property
 * * node-height-roperty
 * * node-fill-color-property
 * * node-stroke-color-property
 * * node-opacity-property
 * * node-type-property
 * * default-node-label
 * * default-node-width
 * * default-node-height
 * * default-node-type
 * * default-node-fill-color
 * * default-node-stroke-color
 * * default-node-opacity
 * * auto-update
 * * auto-centering
 *
 */
class EgRendererElement extends window.HTMLElement {
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
      ctx.scale(devicePixelRatio(), devicePixelRatio())
      ctx.translate(p.margin, p.margin)
      ctx.translate(p.transform.x, p.transform.y)
      ctx.scale(p.transform.k, p.transform.k)
      const data = p.data
      for (const vertex of data.vertices) {
        const u = vertex.u
        for (const v in layout.edges[u]) {
          if (layout.edges[u][v]) {
            renderEdge(ctx, layout.edges[u][v])
          }
        }
      }
      for (const node of data.vertices) {
        const {u} = node
        renderVertex(ctx, Object.assign({}, layout.vertices[u], node))
      }
      ctx.restore()
      window.requestAnimationFrame(render)
    }
    render()

    if (this.hasAttribute('width')) {
      setWidth(this, +this.getAttribute('width'))
    }
    if (this.hasAttribute('height')) {
      setHeight(this, +this.getAttribute('height'))
    }
    if (this.hasAttribute('data')) {
      p.data = loadData(this, this.getAttribute('data'))
      this.layout()
      this.center()
    }
  }

  attributeChangedCallback (attr, oldValue, newValue) {
    const p = privates.get(this)
    switch (attr) {
      case 'data':
        p.data = loadData(this, newValue)
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
        setWidth(this, newValue)
        break
      case 'height':
        setHeight(this, newValue)
        break
    }
  }

  layout () {
    const p = privates.get(this)
    const {data} = p
    const mode = this.getAttribute('layout')

    let layoutResult = layout(data, mode)
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
    const canvasWidth = canvas.width / devicePixelRatio()
    const canvasHeight = canvas.height / devicePixelRatio()
    const {x, y, k} = centerTransform(layoutWidth, layoutHeight, left, top, canvasWidth, canvasHeight, margin)
    zoom.transform(d3.select(canvas), d3.zoomIdentity.translate(x, y).scale(k).translate(-left, -top))
  }
}

document.registerElement('eg-renderer', EgRendererElement)
