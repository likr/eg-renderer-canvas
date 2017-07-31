import * as d3 from 'd3'
import {
  centerTransform,
  layoutRect
} from './centering'
import {
  interpolateVertex,
  interpolateEdge,
  diff
} from './interpolate'
import {
  renderEdge,
  renderVertex
} from './render'
import {zoom} from './zoom'
import {adjustEdge} from './marker-point'

const devicePixelRatio = () => {
  return window.devicePixelRatio || 1.0
}

const get = (...args) => {
  let d = args[0]
  const key = args[1]
  const attrs = key.split('.')
  for (const attr of attrs) {
    if (!d.hasOwnProperty(attr)) {
      if (args.length === 2) {
        throw new Error(`Object doesn't have an attribute ${key}`)
      }
      return args[2]
    }
    d = d[attr]
  }
  return d
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

const getter = (element, attributeName, defaultValue) => {
  if (!element.hasAttribute(attributeName)) {
    return defaultValue
  }
  return element.getAttribute(attributeName)
}

class EgRendererElement extends window.HTMLElement {
  static get observedAttributes () {
    return [
      'src',
      'width',
      'height',
      'graph-nodes-property',
      'graph-links-property',
      'node-id-property',
      'node-x-property',
      'node-y-property',
      'node-width-property',
      'node-height-property',
      'node-type-property',
      'node-visibility-property',
      'node-fill-color-property',
      'node-fill-opacity-property',
      'node-stroke-color-property',
      'node-stroke-opacity-property',
      'node-stroke-width-property',
      'node-label-property',
      'node-label-fill-color-property',
      'node-label-fill-opacity-property',
      'node-label-stroke-color-property',
      'node-label-stroke-opacity-property',
      'node-label-stroke-width-property',
      'link-source-property',
      'link-target-property',
      'link-stroke-color-property',
      'link-stroke-opacity-property',
      'link-stroke-width-property',
      'link-visibility-property',
      'link-source-marker-shape-property',
      'link-source-marker-size-property',
      'link-target-marker-shape-property',
      'link-target-marker-size-property',
      'link-label-property',
      'link-label-fill-color-property',
      'link-label-fill-opacity-property',
      'link-label-stroke-color-property',
      'link-label-stroke-opacity-property',
      'link-label-stroke-width-property',
      'default-node-x',
      'default-node-y',
      'default-node-width',
      'default-node-height',
      'default-node-type',
      'default-node-visibility',
      'default-node-fill-color',
      'default-node-fill-opacity',
      'default-node-stroke-color',
      'default-node-stroke-opacity',
      'default-node-stroke-width',
      'default-node-label',
      'default-node-label-fill-color',
      'default-node-label-fill-opacity',
      'default-node-label-stroke-color',
      'default-node-label-stroke-opacity',
      'default-node-label-stroke-width',
      'default-link-stroke-color',
      'default-link-stroke-opacity',
      'default-link-stroke-width',
      'default-link-visibility',
      'default-link-source-marker-shape',
      'default-link-source-marker-size',
      'default-link-target-marker-shape',
      'default-link-target-marker-size',
      'default-link-label',
      'default-link-label-fill-color',
      'default-link-label-fill-opacity',
      'default-link-label-stroke-color',
      'default-link-label-stroke-opacity',
      'default-link-label-stroke-width'
    ]
  }

  constructor () {
    super()
    const p = {
      invalidate: false,
      originalData: null,
      canvas: document.createElement('canvas'),
      data: {
        vertexIds: [],
        vertices: new Map(),
        edgeIds: [],
        edges: new Map()
      },
      transform: {
        x: 0,
        y: 0,
        k: 1
      },
      highlightedVertex: null,
      layout: {
        update: {
          vertices: [],
          edges: []
        },
        enter: {
          vertices: [],
          edges: []
        },
        exit: {
          vertices: [],
          edges: []
        }
      },
      margin: 10,
      layoutTime: 0,
      ease: d3.easeCubic
    }
    p.zoom = zoom(this, p)
    privates.set(this, p)

    d3.select(p.canvas)
      .call(p.zoom)

    p.canvas.addEventListener('mousemove', (event) => {
      if (this.canDragNode && event.region) {
        p.canvas.style.cursor = 'pointer'
        p.highlightedVertex = event.region
      } else if (this.canZoom) {
        p.canvas.style.cursor = 'move'
        p.highlightedVertex = null
      } else {
        p.canvas.style.cursor = 'default'
      }
    })
  }

  connectedCallback () {
    const p = privates.get(this)
    this.appendChild(p.canvas)

    const render = () => {
      if (p.invalidate && p.originalData) {
        this.update(true)
      }
      p.invalidate = false
      const now = new Date()
      const transitionDuration = this.transitionDuration
      const t = now > p.layoutTime ? (now - p.layoutTime) / transitionDuration : 1 / transitionDuration
      const r = p.ease(t)
      const ctx = p.canvas.getContext('2d')
      ctx.save()
      ctx.clearRect(0, 0, p.canvas.width, p.canvas.height)
      ctx.scale(devicePixelRatio(), devicePixelRatio())
      ctx.translate(p.margin, p.margin)
      ctx.translate(p.transform.x, p.transform.y)
      ctx.scale(p.transform.k, p.transform.k)
      if (r < 1) {
        ctx.globalAlpha = 1 - r
        for (const edge of p.layout.exit.edges) {
          renderEdge(ctx, edge)
        }
      }
      ctx.globalAlpha = Math.min(1, r)
      for (const edge of p.layout.enter.edges) {
        renderEdge(ctx, edge)
      }
      ctx.globalAlpha = 1
      for (const {current, next} of p.layout.update.edges) {
        if (r < 1) {
          renderEdge(ctx, interpolateEdge(current, next, r))
        } else {
          renderEdge(ctx, next)
        }
      }
      if (r < 1) {
        ctx.globalAlpha = 1 - r
        for (const vertex of p.layout.exit.vertices) {
          renderVertex(ctx, vertex)
        }
      }
      ctx.globalAlpha = Math.min(1, r)
      for (const vertex of p.layout.enter.vertices) {
        renderVertex(ctx, vertex)
      }
      ctx.globalAlpha = 1
      for (const {current, next} of p.layout.update.vertices) {
        if (r < 1) {
          renderVertex(ctx, interpolateVertex(current, next, r))
        } else {
          renderVertex(ctx, next)
        }
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
            this.dispatchEvent(new window.CustomEvent('datafetchend', {detail: data}))
            this.load(data)
          })
        break
      case 'width':
        setWidth(this, newValue)
        break
      case 'height':
        setHeight(this, newValue)
        break
      default:
        this.invalidate()
    }
  }

  layout () {
    const p = privates.get(this)
    const {data} = p
    this.onLayout(data)
    for (const [u, v] of data.edgeIds) {
      const edge = data.edges.get(u).get(v)
      const du = data.vertices.get(u)
      const dv = data.vertices.get(v)
      adjustEdge(edge, du, dv)
    }
    p.layout = diff(p.prevData, data)
    p.layoutTime = new Date()
    if (this.autoCentering) {
      this.center()
    }
    return this
  }

  center () {
    const {canvas, data, margin, zoom} = privates.get(this)
    const {layoutWidth, layoutHeight, left, top} = layoutRect(data)
    const canvasWidth = canvas.width / devicePixelRatio()
    const canvasHeight = canvas.height / devicePixelRatio()
    const {x, y, k} = centerTransform(layoutWidth, layoutHeight, left, top, canvasWidth, canvasHeight, margin)
    zoom.transform(d3.select(canvas), d3.zoomIdentity.translate(x, y).scale(k).translate(-left, -top))
    return this
  }

  load (data) {
    privates.get(this).originalData = data
    return this.update()
  }

  update (preservePos = false) {
    const p = privates.get(this)
    p.prevData = p.data
    const data = p.originalData
    const vertices = get(data, this.graphNodesProperty)
      .filter((node) => get(node, this.nodeVisibilityProperty, this.defaultNodeVisibility))
      .map((node, i) => {
        const fillColor = d3.color(get(node, this.nodeFillColorProperty, this.defaultNodeFillColor))
        fillColor.opacity = +get(node, this.nodeFillOpacityProperty, this.defaultNodeFillOpacity)
        const strokeColor = d3.color(get(node, this.nodeStrokeColorProperty, this.defaultNodeStrokeColor))
        strokeColor.opacity = +get(node, this.nodeStrokeOpacityProperty, this.defaultNodeStrokeOpacity)
        const labelFillColor = d3.color(get(node, this.nodeLabelFillColorProperty, this.defaultNodeLabelFillColor))
        labelFillColor.opacity = +get(node, this.nodeLabelFillOpacityProperty, this.defaultNodeLabelFillOpacity)
        const labelStrokeColor = d3.color(get(node, this.nodeLabelStrokeColorProperty, this.defaultNodeLabelStrokeColor))
        labelStrokeColor.opacity = +get(node, this.nodeLabelStrokeOpacityProperty, this.defaultNodeLabelStrokeOpacity)
        const u = (this.nodeIdProperty === '$index' ? i : get(node, this.nodeIdProperty)).toString()
        return {
          u,
          x: preservePos && p.prevData.vertices.has(u) ? p.prevData.vertices.get(u).x : +get(node, this.nodeXProperty, this.defaultNodeX),
          y: preservePos && p.prevData.vertices.has(u) ? p.prevData.vertices.get(u).y : +get(node, this.nodeYProperty, this.defaultNodeY),
          width: +get(node, this.nodeWidthProperty, this.defaultNodeWidth),
          height: +get(node, this.nodeHeightProperty, this.defaultNodeHeight),
          type: get(node, this.nodeTypeProperty, this.defaultNodeType),
          fillColor,
          strokeColor,
          strokeWidth: +get(node, this.nodeStrokeWidthProperty, this.defaultNodeStrokeWidth),
          label: get(node, this.nodeLabelProperty, this.defaultNodeLabel),
          labelFillColor,
          labelStrokeColor,
          labelStrokeWidth: +get(node, this.nodeLabelStrokeWidthProperty, this.defaultNodeLabelStrokeWidth),
          inEdges: [],
          outEdges: [],
          d: node
        }
      })
    const indices = new Map(vertices.map(({u}, i) => [u, i]))
    const edges = get(data, this.graphLinksProperty)
      .filter((link) => get(link, this.linkVisibilityProperty, this.defaultLinkVisibility))
      .filter((link) => {
        const u = get(link, this.linkSourceProperty).toString()
        const v = get(link, this.linkTargetProperty).toString()
        return indices.has(u) && indices.has(v)
      })
      .map((link) => {
        const u = get(link, this.linkSourceProperty).toString()
        const v = get(link, this.linkTargetProperty).toString()
        const strokeColor = d3.color(get(link, this.linkStrokeColorProperty, this.defaultLinkStrokeColor))
        strokeColor.opacity = +get(link, this.linkStrokeOpacityProperty, this.defaultLinkStrokeOpacity)
        const labelFillColor = d3.color(get(link, this.linkLabelFillColorProperty, this.defaultLinkLabelFillColor))
        labelFillColor.opacity = +get(link, this.linkLabelFillOpacityProperty, this.defaultLinkLabelFillOpacity)
        const labelStrokeColor = d3.color(get(link, this.linkLabelStrokeColorProperty, this.defaultLinkLabelStrokeColor))
        labelStrokeColor.opacity = +get(link, this.linkLabelStrokeOpacityProperty, this.defaultLinkLabelStrokeOpacity)
        const du = vertices[indices.get(u)]
        const dv = vertices[indices.get(v)]
        const newPoints = [[du.x, du.y]]
        for (const [x, y] of get(link, this.linkBendsProperty, [])) {
          newPoints.push([x, y])
        }
        newPoints.push([dv.x, dv.y])
        const points = preservePos && p.prevData.edges.has(u) && p.prevData.edges.get(u).has(v)
          ? p.prevData.edges.get(u).get(v).points
          : newPoints
        const edge = {
          u,
          v,
          points,
          type: get(link, this.linkTypeProperty, this.defaultLinkType),
          strokeColor,
          strokeWidth: +get(link, this.linkStrokeWidthProperty, this.defaultLinkStrokeWidth),
          sourceMarkerShape: get(link, this.linkSourceMarkerShapeProperty, this.defaultLinkSourceMarkerShape),
          sourceMarkerSize: +get(link, this.linkSourceMarkerSizeProperty, this.defaultLinkSourceMarkerSize),
          targetMarkerShape: get(link, this.linkTargetMarkerShapeProperty, this.defaultLinkTargetMarkerShape),
          targetMarkerSize: +get(link, this.linkTargetMarkerSizeProperty, this.defaultLinkTargetMarkerSize),
          label: get(link, this.linkLabelProperty, this.defaultLinkLabel),
          labelFillColor,
          labelStrokeColor,
          labelStrokeWidth: +get(link, this.linkLabelStrokeWidthProperty, this.defaultLinkLabelStrokeWidth),
          d: link
        }
        du.outEdges.push(edge)
        dv.inEdges.push(edge)
        return edge
      })
    p.data = {
      vertexIds: vertices.map(({u}) => u),
      vertices: new Map(vertices.map((vertex) => [vertex.u, vertex])),
      edgeIds: edges.map(({u, v}) => [u, v]),
      edges: new Map(vertices.map((vertex) => [vertex.u, new Map()]))
    }
    for (const edge of edges) {
      p.data.edges.get(edge.u).set(edge.v, edge)
    }
    if (this.autoUpdate) {
      this.layout()
    }
    return this
  }

  onLayout () {
  }

  invalidate () {
    privates.get(this).invalidate = true
  }

  get autoUpdate () {
    return !this.hasAttribute('no-auto-update')
  }

  set autoUpdate (value) {
    if (value) {
      this.removeAttribute('no-auto-update')
    } else {
      this.setAttribute('no-auto-update', '')
    }
  }

  get autoCentering () {
    return !this.hasAttribute('no-auto-centering')
  }

  set autoCentering (value) {
    if (value) {
      this.removeAttribute('no-auto-centering')
    } else {
      this.setAttribute('no-auto-centering', '')
    }
  }

  get canZoom () {
    return !this.hasAttribute('no-zoom')
  }

  set canZoom (value) {
    if (value) {
      this.removeAttribute('no-zoom')
    } else {
      this.setAttribute('no-zoom', '')
    }
  }

  get canDragNode () {
    return !this.hasAttribute('no-drag-node')
  }

  set canDragNode (value) {
    if (value) {
      this.removeAttribute('no-drag-node')
    } else {
      this.setAttribute('no-drag-node', '')
    }
  }

  get src () {
    return getter(this, 'src', null)
  }

  set src (value) {
    this.setAttribute('src', value)
  }

  get width () {
    return getter(this, 'width', 300)
  }

  set width (value) {
    this.setAttribute('width', value)
  }

  get height () {
    return getter(this, 'height', 150)
  }

  set height (value) {
    this.setAttribute('height', value)
  }

  get transitionDuration () {
    return getter(this, 'transition-duration', 0)
  }

  set transitionDuration (value) {
    this.setAttribute('transition-duration', value)
  }

  get graphNodesProperty () {
    return getter(this, 'graph-nodes-property', 'nodes')
  }

  set graphNodesProperty (value) {
    this.setAttribute('graph-nodes-property', value)
  }

  get graphLinksProperty () {
    return getter(this, 'graph-links-property', 'links')
  }

  set graphLinksProperty (value) {
    this.setAttribute('graph-links-property', value)
  }

  get nodeIdProperty () {
    return getter(this, 'node-id-property', '$index')
  }

  set nodeIdProperty (value) {
    this.setAttribute('node-id-property', value)
  }

  get nodeXProperty () {
    return getter(this, 'node-x-property', 'x')
  }

  set nodeXProperty (value) {
    this.setAttribute('node-x-property', value)
  }

  get nodeYProperty () {
    return getter(this, 'node-y-property', 'y')
  }

  set nodeYProperty (value) {
    this.setAttribute('node-y-property', value)
  }

  get nodeWidthProperty () {
    return getter(this, 'node-width-property', 'width')
  }

  set nodeWidthProperty (value) {
    this.setAttribute('node-width-property', value)
  }

  get nodeHeightProperty () {
    return getter(this, 'node-height-property', 'height')
  }

  set nodeHeightProperty (value) {
    this.setAttribute('node-height-property', value)
  }

  get nodeFillColorProperty () {
    return getter(this, 'node-fill-color-property', 'fillColor')
  }

  set nodeFillColorProperty (value) {
    this.setAttribute('node-fill-color-property', value)
  }

  get nodeFillOpacityProperty () {
    return getter(this, 'node-fill-opacity-property', 'fillOpacity')
  }

  set nodeFillOpacityProperty (value) {
    this.setAttribute('node-fill-opacity-property', value)
  }

  get nodeStrokeColorProperty () {
    return getter(this, 'node-stroke-color-property', 'strokeColor')
  }

  set nodeStrokeColorProperty (value) {
    this.setAttribute('node-stroke-color-property', value)
  }

  get nodeStrokeOpacityProperty () {
    return getter(this, 'node-stroke-opacity-property', 'strokeOpacity')
  }

  set nodeStrokeOpacityProperty (value) {
    this.setAttribute('node-stroke-opacity-property', value)
  }

  get nodeStrokeWidthProperty () {
    return getter(this, 'node-stroke-width-property', 'strokeWidth')
  }

  set nodeStrokeWidthProperty (value) {
    this.setAttribute('node-stroke-width-property', value)
  }

  get nodeTypeProperty () {
    return getter(this, 'node-type-property', 'type')
  }

  set nodeTypeProperty (value) {
    this.setAttribute('node-type-property', value)
  }

  get nodeVisibilityProperty () {
    return getter(this, 'node-visibility-property', 'visibility')
  }

  set nodeVisibilityProperty (value) {
    this.setAttribute('node-visibility-property', value)
  }

  get nodeLabelProperty () {
    return getter(this, 'node-label-property', 'label')
  }

  set nodeLabelProperty (value) {
    this.setAttribute('node-label-property', value)
  }

  get nodeLabelFillColorProperty () {
    return getter(this, 'node-label-fill-color-property', 'labelFillColor')
  }

  set nodeLabelFillColorProperty (value) {
    this.setAttribute('node-label-fill-color-property', value)
  }

  get nodeLabelFillOpacityProperty () {
    return getter(this, 'node-label-fill-opacity-property', 'labelFillOpacity')
  }

  set nodeLabelFillOpacityProperty (value) {
    this.setAttribute('node-label-fill-opacity-property', value)
  }

  get nodeLabelStrokeColorProperty () {
    return getter(this, 'node-label-stroke-color-property', 'labelStrokeColor')
  }

  set nodeLabelStrokeColorProperty (value) {
    this.setAttribute('node-label-stroke-color-property', value)
  }

  get nodeLabelStrokeOpacityProperty () {
    return getter(this, 'node-label-stroke-opacity-property', 'labelStrokeOpacity')
  }

  set nodeLabelStrokeOpacityProperty (value) {
    this.setAttribute('node-label-stroke-opacity-property', value)
  }

  get nodeLabelStrokeWidthProperty () {
    return getter(this, 'node-label-stroke-width-property', 'labelStrokeWidth')
  }

  set nodeLabelStrokeWidthProperty (value) {
    this.setAttribute('node-label-stroke-width-property', value)
  }

  get linkSourceProperty () {
    return getter(this, 'link-source-property', 'source')
  }

  set linkSourceProperty (value) {
    this.setAttribute('link-source-property', value)
  }

  get linkTargetProperty () {
    return getter(this, 'link-target-property', 'target')
  }

  set linkTargetProperty (value) {
    this.setAttribute('link-target-property', value)
  }

  get linkBendsProperty () {
    return getter(this, 'link-bends-property', 'bends')
  }

  set linkBendsProperty (value) {
    this.setAttribute('link-bends-property', value)
  }

  get linkStrokeColorProperty () {
    return getter(this, 'link-stroke-color-property', 'strokeColor')
  }

  set linkStrokeColorProperty (value) {
    this.setAttribute('link-stroke-color-property', value)
  }

  get linkStrokeOpacityProperty () {
    return getter(this, 'link-stroke-opacity-property', 'strokeOpacity')
  }

  set linkStrokeOpacityProperty (value) {
    this.setAttribute('link-stroke-opacity-property', value)
  }

  get linkStrokeWidthProperty () {
    return getter(this, 'link-stroke-width-property', 'strokeWidth')
  }

  set linkStrokeWidthProperty (value) {
    this.setAttribute('link-stroke-width-property', value)
  }

  get linkTypeProperty () {
    return getter(this, 'link-type-property', 'type')
  }

  set linkTypeProperty (value) {
    this.setAttribute('link-type-property', value)
  }

  get linkVisibilityProperty () {
    return getter(this, 'link-visibility-property', 'visibility')
  }

  set linkVisibilityProperty (value) {
    this.setAttribute('link-visibility-property', value)
  }

  get linkSourceMarkerShapeProperty () {
    return getter(this, 'link-source-marker-shape-property', 'sourceMarkerShape')
  }

  set linkSourceMarkerShapeProperty (value) {
    this.setAttribute('link-source-marker-shape-property', value)
  }

  get linkSourceMarkerSizeProperty () {
    return getter(this, 'link-source-marker-size-property', 'sourceMarkerSize')
  }

  set linkSourceMarkerSizeProperty (value) {
    this.setAttribute('link-source-marker-size-property', value)
  }

  get linkTargetMarkerShapeProperty () {
    return getter(this, 'link-target-marker-shape-property', 'targetMarkerShape')
  }

  set linkTargetMarkerShapeProperty (value) {
    this.setAttribute('link-target-marker-shape-property', value)
  }

  get linkTargetMarkerSizeProperty () {
    return getter(this, 'link-target-marker-size-property', 'targetMarkerSize')
  }

  set linkTargetMarkerSizeProperty (value) {
    this.setAttribute('link-target-marker-size-property', value)
  }

  get linkLabelProperty () {
    return getter(this, 'link-label-property', 'label')
  }

  set linkLabelProperty (value) {
    this.setAttribute('link-label-property', value)
  }

  get linkLabelFillColorProperty () {
    return getter(this, 'link-label-fill-color-property', 'labelFillColor')
  }

  set linkLabelFillColorProperty (value) {
    this.setAttribute('link-label-fill-color-property', value)
  }

  get linkLabelFillOpacityProperty () {
    return getter(this, 'link-label-fill-opacity-property', 'labelFillOpacity')
  }

  set linkLabelFillOpacityProperty (value) {
    this.setAttribute('link-label-fill-opacity-property', value)
  }

  get linkLabelStrokeColorProperty () {
    return getter(this, 'link-label-stroke-color-property', 'labelStrokeColor')
  }

  set linkLabelStrokeColorProperty (value) {
    this.setAttribute('link-label-stroke-color-property', value)
  }

  get linkLabelStrokeOpacityProperty () {
    return getter(this, 'link-label-stroke-opacity-property', 'labelStrokeOpacity')
  }

  set linkLabelStrokeOpacityProperty (value) {
    this.setAttribute('link-label-stroke-opacity-property', value)
  }

  get linkLabelStrokeWidthProperty () {
    return getter(this, 'link-label-stroke-width-property', 'labelStrokeWidth')
  }

  set linkLabelStrokeWidthProperty (value) {
    this.setAttribute('link-label-stroke-width-property', value)
  }

  get defaultNodeX () {
    return getter(this, 'default-node-x', 0)
  }

  set defaultNodeX (value) {
    this.setAttribute('default-node-x', value)
  }

  get defaultNodeY () {
    return getter(this, 'default-node-y', 0)
  }

  set defaultNodeY (value) {
    this.setAttribute('default-node-y', value)
  }

  get defaultNodeWidth () {
    return getter(this, 'default-node-width', 10)
  }

  set defaultNodeWidth (value) {
    this.setAttribute('default-node-width', value)
  }

  get defaultNodeHeight () {
    return getter(this, 'default-node-height', 10)
  }

  set defaultNodeHeight (value) {
    this.setAttribute('default-node-height', value)
  }

  get defaultNodeFillColor () {
    return getter(this, 'default-node-fill-color', '#fff')
  }

  set defaultNodeFillColor (value) {
    this.setAttribute('default-node-fill-color', value)
  }

  get defaultNodeFillOpacity () {
    return getter(this, 'default-node-fill-opacity', 1)
  }

  set defaultNodeFillOpacity (value) {
    this.setAttribute('default-node-fill-opacity', value)
  }

  get defaultNodeStrokeColor () {
    return getter(this, 'default-node-stroke-color', '#000')
  }

  set defaultNodeStrokeColor (value) {
    this.setAttribute('default-node-stroke-color', value)
  }

  get defaultNodeStrokeOpacity () {
    return getter(this, 'default-node-stroke-opacity', 1)
  }

  set defaultNodeStrokeOpacity (value) {
    this.setAttribute('default-node-stroke-opacity', value)
  }

  get defaultNodeStrokeWidth () {
    return getter(this, 'default-node-stroke-width', 1)
  }

  set defaultNodeStrokeWidth (value) {
    this.setAttribute('default-node-stroke-width', value)
  }

  get defaultNodeType () {
    return getter(this, 'default-node-type', 'circle')
  }

  set defaultNodeType (value) {
    this.setAttribute('default-node-type', value)
  }

  get defaultNodeVisibility () {
    return getter(this, 'default-node-visibility', true)
  }

  set defaultNodeVisibility (value) {
    this.setAttribute('default-node-visibility', value)
  }

  get defaultNodeLabel () {
    return getter(this, 'default-node-label', '')
  }

  set defaultNodeLabel (value) {
    this.setAttribute('default-node-label', value)
  }

  get defaultNodeLabelFillColor () {
    return getter(this, 'default-node-label-fill-color', '#000')
  }

  set defaultNodeLabelFillColor (value) {
    this.setAttribute('default-node-label-fill-color', value)
  }

  get defaultNodeLabelFillOpacity () {
    return getter(this, 'default-node-label-fill-opacity', 1)
  }

  set defaultNodeLabelFillOpacity (value) {
    this.setAttribute('default-node-label-fill-opacity', value)
  }

  get defaultNodeLabelStrokeColor () {
    return getter(this, 'default-node-label-stroke-color', '#fff')
  }

  set defaultNodeLabelStrokeColor (value) {
    this.setAttribute('default-node-label-stroke-color', value)
  }

  get defaultNodeLabelStrokeOpacity () {
    return getter(this, 'default-node-label-stroke-opacity', 1)
  }

  set defaultNodeLabelStrokeOpacity (value) {
    this.setAttribute('default-node-label-stroke-opacity', value)
  }

  get defaultNodeLabelStrokeWidth () {
    return getter(this, 'default-node-label-stroke-width', 0)
  }

  set defaultNodeLabelStrokeWidth (value) {
    this.setAttribute('default-node-label-stroke-width', value)
  }

  get defaultLinkStrokeColor () {
    return getter(this, 'default-link-stroke-color', '#000')
  }

  set defaultLinkStrokeColor (value) {
    this.setAttribute('default-link-stroke-color', value)
  }

  get defaultLinkStrokeOpacity () {
    return getter(this, 'default-link-stroke-opacity', 1)
  }

  set defaultLinkStrokeOpacity (value) {
    this.setAttribute('default-link-stroke-opacity', value)
  }

  get defaultLinkStrokeWidth () {
    return getter(this, 'default-link-stroke-width', 1)
  }

  set defaultLinkStrokeWidth (value) {
    this.setAttribute('default-link-stroke-width', value)
  }

  get defaultLinkType () {
    return getter(this, 'default-link-type', 'line')
  }

  set defaultLinkType (value) {
    this.setAttribute('default-link-type', value)
  }

  get defaultLinkVisibility () {
    return getter(this, 'default-link-visibility', true)
  }

  set defaultLinkVisibility (value) {
    this.setAttribute('default-link-visibility', value)
  }

  get defaultLinkSourceMarkerShape () {
    return getter(this, 'default-link-source-marker-shape', 'none')
  }

  set defaultLinkSourceMarkerShape (value) {
    this.setAttribute('default-link-source-marker-shape', value)
  }

  get defaultLinkSourceMarkerSize () {
    return getter(this, 'default-link-source-marker-size', 5)
  }

  set defaultLinkSourceMarkerSize (value) {
    this.setAttribute('default-link-source-marker-size', value)
  }

  get defaultLinkTargetMarkerShape () {
    return getter(this, 'default-link-target-marker-shape', 'none')
  }

  set defaultLinkTargetMarkerShape (value) {
    this.setAttribute('default-link-target-marker-shape', value)
  }

  get defaultLinkTargetMarkerSize () {
    return getter(this, 'default-link-target-marker-size', 5)
  }

  set defaultLinkTargetMarkerSize (value) {
    this.setAttribute('default-link-target-marker-size', value)
  }

  get defaultLinkLabel () {
    return getter(this, 'default-link-label', '')
  }

  set defaultLinkLabel (value) {
    this.setAttribute('default-link-label', value)
  }

  get defaultLinkLabelFillColor () {
    return getter(this, 'default-link-label-fill-color', '#000')
  }

  set defaultLinkLabelFillColor (value) {
    this.setAttribute('default-link-label-fill-color', value)
  }

  get defaultLinkLabelFillOpacity () {
    return getter(this, 'default-link-label-fill-opacity', 1)
  }

  set defaultLinkLabelFillOpacity (value) {
    this.setAttribute('default-link-label-fill-opacity', value)
  }

  get defaultLinkLabelStrokeColor () {
    return getter(this, 'default-link-label-stroke-color', '#fff')
  }

  set defaultLinkLabelStrokeColor (value) {
    this.setAttribute('default-link-label-stroke-color', value)
  }

  get defaultLinkLabelStrokeOpacity () {
    return getter(this, 'default-link-label-stroke-opacity', 1)
  }

  set defaultLinkLabelStrokeOpacity (value) {
    this.setAttribute('default-link-label-stroke-opacity', value)
  }

  get defaultLinkLabelStrokeWidth () {
    return getter(this, 'default-link-label-stroke-width', 0)
  }

  set defaultLinkLabelStrokeWidth (value) {
    this.setAttribute('default-link-label-stroke-width', value)
  }

  get data () {
    return privates.get(this).originalData
  }
}

window.customElements.define('eg-renderer', EgRendererElement)
