import * as d3 from 'd3'
import {adjustEdge} from './marker-point'

export const zoom = (attrs) => {
  const pos = {
    region: null,
    x0: 0,
    y0: 0
  }
  const zoom = d3.zoom()
  zoom
    .on('start', () => {
      if (d3.event.sourceEvent && d3.event.sourceEvent.region) {
        const {x, y, k} = d3.event.transform
        pos.region = d3.event.sourceEvent.region
        pos.x0 = x / k
        pos.y0 = y / k
      }
    })
    .on('zoom', () => {
      const {x, y, k} = d3.event.transform
      if (pos.region) {
        const u = pos.region
        const dx = x / k - pos.x0
        const dy = y / k - pos.y0
        const {data} = attrs
        const vertex = data.vertices[data.indices.get(u)]
        vertex.x += dx
        vertex.y += dy
        for (const edge of vertex.outEdges) {
          const {points} = edge
          points[0][0] += dx
          points[0][1] += dy
          adjustEdge(edge, vertex, data.vertices[data.indices.get(edge.v)])
        }
        for (const edge of vertex.inEdges) {
          const {points} = edge
          points[points.length - 1][0] += dx
          points[points.length - 1][1] += dy
          adjustEdge(edge, data.vertices[data.indices.get(edge.u)], vertex)
        }
        pos.x0 = x / k
        pos.y0 = y / k
      } else {
        Object.assign(attrs.transform, {
          x,
          y,
          k
        })
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
