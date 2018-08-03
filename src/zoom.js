import {
  event as d3Event,
  select as d3Select
} from 'd3-selection'
import {
  zoom as d3Zoom,
  zoomIdentity as d3ZoomIdentity
} from 'd3-zoom'
import {adjustEdge} from './marker-point'

const dispatchNodeMoveStartEvent = (element, u) => {
  const event = new window.CustomEvent('nodemovestart', {
    detail: {
      id: u
    }
  })
  element.dispatchEvent(event)
}

const dispatchNodeMoveEvent = (element, {u, x, y}) => {
  const event = new window.CustomEvent('nodemove', {
    detail: {
      id: u,
      x,
      y
    }
  })
  element.dispatchEvent(event)
}

const dispatchNodeMoveEndEvent = (element, u) => {
  const event = new window.CustomEvent('nodemoveend', {
    detail: {
      id: u
    }
  })
  element.dispatchEvent(event)
}

export const zoom = (element, attrs) => {
  const pos = {
    region: null,
    x0: 0,
    y0: 0
  }
  let restoreTransform = false
  const zoom = d3Zoom()
  zoom
    .on('start', () => {
      if (!element.canZoom || (element.canDragNode && d3Event.sourceEvent && d3Event.sourceEvent.region)) {
        const u = d3Event.sourceEvent ? JSON.parse(d3Event.sourceEvent.region).id : null
        const {x, y, k} = d3Event.transform
        pos.region = u
        pos.x0 = x / k
        pos.y0 = y / k
        if (u) {
          dispatchNodeMoveStartEvent(element, u)
        }
      }
    })
    .on('zoom', () => {
      const {x, y, k} = d3Event.transform
      if (element.canDragNode && pos.region) {
        const u = pos.region
        const dx = x / k - pos.x0
        const dy = y / k - pos.y0
        const {data} = attrs
        const vertex = data.vertices.get(u)
        vertex.x += dx
        vertex.y += dy
        for (const edge of vertex.outEdges) {
          const {points} = edge
          points[0][0] += dx
          points[0][1] += dy
          adjustEdge(edge, vertex, data.vertices.get(edge.v))
        }
        for (const edge of vertex.inEdges) {
          const {points} = edge
          points[points.length - 1][0] += dx
          points[points.length - 1][1] += dy
          adjustEdge(edge, data.vertices.get(edge.u), vertex)
        }
        pos.x0 = x / k
        pos.y0 = y / k
        dispatchNodeMoveEvent(element, vertex)
      } else if (element.canZoom || !d3Event.sourceEvent) {
        Object.assign(attrs.transform, {
          x,
          y,
          k
        })
      }
    })
    .on('end', function () {
      if (!restoreTransform && (!element.canZoom || pos.region)) {
        const u = pos.region
        pos.region = null
        restoreTransform = true
        d3Select(this)
          .call(zoom.transform, d3ZoomIdentity.translate(attrs.transform.x, attrs.transform.y).scale(attrs.transform.k))
        restoreTransform = false
        if (u) {
          dispatchNodeMoveEndEvent(element, u)
        }
      }
    })
  return zoom
}
