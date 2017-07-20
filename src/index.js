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

class EgRendererElement extends window.HTMLElement {
  static get observedAttributes () {
    return [
      'src',
      'data',
      'layout',
      'width',
      'height'
    ]
  }

  constructor () {
    super()
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

    this.appendChild(p.canvas)

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
      for (const edge of data.edges) {
        const {u, v} = edge
        if (layout.edges[u][v]) {
          renderEdge(ctx, layout.edges[u][v])
        }
      }
      for (const node of data.vertices) {
        const {u} = node
        renderVertex(ctx, layout.vertices[u])
      }
      ctx.restore()
      window.requestAnimationFrame(render)
    }
    render()
  }

  attributeChangedCallback (attr, oldValue, newValue) {
    switch (attr) {
      case 'src':
        window.fetch(newValue)
          .then((response) => response.json())
          .then((data) => {
            this.load(data)
          })
        break
      case 'data':
        this.load(JSON.parse(newValue))
        break
      case 'layout':
        if (!this.hasAttribute('no-auto-update')) {
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
    const mode = this.getAttribute('layout') || 'fmmm'

    let layoutResult = layout(data, mode)
    p.previousLayoutResult = diff(p.layoutResult, layoutResult)
    p.layoutResult = layoutResult
    p.layoutTime = new Date()
    if (!this.hasAttribute('no-auto-centering')) {
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
    return this
  }

  load (data) {
    const graphNodesProperty = this.getAttribute('graph-nodes-property') || 'nodes'
    const graphLinksProperty = this.getAttribute('graph-links-property') || 'links'
    const nodeIdProperty = this.getAttribute('node-id-property') || '$index'
    const nodeLabelProperty = this.getAttribute('node-label-property') || 'label'
    const nodeWidthProperty = this.getAttribute('node-width-property') || 'width'
    const nodeHeightProperty = this.getAttribute('node-height-property') || 'height'
    const nodeFillColorProperty = this.getAttribute('node-fill-color-property') || 'fill'
    const nodeStrokeColorProperty = this.getAttribute('node-stroke-color-property') || 'stroke'
    const nodeStrokeOpacityProperty = this.getAttribute('node-stroke-opacity-property') || 'strokeOpacity'
    const nodeStrokeWidthProperty = this.getAttribute('node-stroke-width-property') || 'strokeWidth'
    const nodeTypeProperty = this.getAttribute('node-type-property') || 'type'
    const linkSourceProperty = this.getAttribute('link-source-property') || 'source'
    const linkTargetProperty = this.getAttribute('link-target-property') || 'target'
    const linkStrokeColorProperty = this.getAttribute('link-stroke-color-property') || 'stroke'
    const linkStrokeOpacityProperty = this.getAttribute('link-stroke-opacity-property') || 'strokeOpacity'
    const linkStrokeWidthProperty = this.getAttribute('link-stroke-width-property') || 'strokeWidth'
    const defaultNodeLabel = this.getAttribute('default-node-label') || ''
    const defaultNodeWidth = this.getAttribute('default-node-width') || 10
    const defaultNodeHeight = this.getAttribute('default-node-height') || 10
    const defaultNodeFillColor = this.getAttribute('default-node-fill-color') || '#fff'
    const defaultNodeStrokeColor = this.getAttribute('default-node-stroke-color') || '#000'
    const defaultNodeStrokeOpacity = this.getAttribute('default-node-stroke-opacity') || '1'
    const defaultNodeStrokeWidth = this.getAttribute('default-node-stroke-width') || '1'
    const defaultNodeType = this.getAttribute('default-node-type') || 'rect'
    const defaultLinkStrokeColor = this.getAttribute('default-link-stroke-color') || '#000'
    const defaultLinkStrokeOpacity = this.getAttribute('default-link-stroke-opacity') || '1'
    const defaultLinkStrokeWidth = this.getAttribute('default-link-stroke-width') || '1'
    privates.get(this).data = {
      vertices: data[graphNodesProperty].map((node, i) => {
        return {
          u: nodeIdProperty === '$index' ? i : node[nodeIdProperty],
          label: get(node, nodeLabelProperty, defaultNodeLabel),
          width: +get(node, nodeWidthProperty, defaultNodeWidth),
          height: +get(node, nodeHeightProperty, defaultNodeHeight),
          type: get(node, nodeTypeProperty, defaultNodeType),
          fillColor: get(node, nodeFillColorProperty, defaultNodeFillColor),
          strokeColor: get(node, nodeStrokeColorProperty, defaultNodeStrokeColor),
          strokeOpacity: get(node, nodeStrokeOpacityProperty, defaultNodeStrokeOpacity),
          strokeWidth: get(node, nodeStrokeWidthProperty, defaultNodeStrokeWidth),
          d: node
        }
      }),
      edges: data[graphLinksProperty].map((link) => {
        const strokeColor = d3.color(get(link, linkStrokeColorProperty, defaultLinkStrokeColor))
        const strokeOpacity = +get(link, linkStrokeOpacityProperty, defaultLinkStrokeOpacity)
        strokeColor.opacity = strokeOpacity
        return {
          u: link[linkSourceProperty],
          v: link[linkTargetProperty],
          strokeColor,
          strokeWidth: +get(link, linkStrokeWidthProperty, defaultLinkStrokeWidth),
          d: link
        }
      })
    }
    if (!this.hasAttribute('no-auto-update')) {
      this.layout()
    }
    return this
  }
}

window.customElements.define('eg-renderer', EgRendererElement)
