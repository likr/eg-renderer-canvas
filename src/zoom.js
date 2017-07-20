import * as d3 from 'd3'

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
        const dx = x / k - pos.x0
        const dy = y / k - pos.y0
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
