# EgRenderer

Easy graph rendering tool using custom elements.

## Example

index.html

```html
<script>
if (!window.customElements) {
  window.customElements = {}
}
window.customElements.forcePolyfill = true
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/custom-elements/1.0.0/custom-elements.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.10.0/d3.min.js"></script>
<script async src="https://likr.github.io/eg-renderer-canvas/eg-renderer.js"></script>
<eg-renderer width="600" height="400" src="data.json"></eg-renderer>
```

data.json

```json
{
  "nodes": [
    {"label": "source", "type": "circle", "x": 100, "y": 100, "width": 120, "height": 20, "fillColor": "green"},
    {"label": "target", "type": "rect", "x": 200, "y": 200, "width": 120, "height": 20, "fillColor": "red"}
  ],
  "links": [
    {"source": 0, "target": 1, "sourceMarkerShape": "circle", "targetMarkerShape": "triangle"}
  ]
}
```

## Demos

https://likr.github.io/eg-renderer-canvas/

## API

### Properties

#### EgRendererElement.autoUpdate

#### EgRendererElement.autoCentering

#### EgRendererElement.src

#### EgRendererElement.data

#### EgRendererElement.width

#### EgRendererElement.height

#### EgRendererElement.graphNodesProperty

#### EgRendererElement.graphLinksProperty

#### EgRendererElement.nodeIdProperty

#### EgRendererElement.nodeXProperty

#### EgRendererElement.nodeYProperty

#### EgRendererElement.nodeWidthProperty

#### EgRendererElement.nodeHeightProperty

#### EgRendererElement.nodeFillColorProperty

#### EgRendererElement.nodeFillOpacityProperty

#### EgRendererElement.nodeStrokeColorProperty

#### EgRendererElement.nodeStrokeOpacityProperty

#### EgRendererElement.nodeStrokeWidthProperty

#### EgRendererElement.nodeTypeProperty

#### EgRendererElement.nodeLabelProperty

#### EgRendererElement.nodeLabelFillColorProperty

#### EgRendererElement.nodeLabelFillOpacityProperty

#### EgRendererElement.nodeLabelStrokeColorProperty

#### EgRendererElement.nodeLabelStrokeOpacityProperty

#### EgRendererElement.nodeLabelStrokeWidthProperty

#### EgRendererElement.linkSourceProperty

#### EgRendererElement.linkTargetProperty

#### EgRendererElement.linkStrokeColorProperty

#### EgRendererElement.linkStrokeOpacityProperty

#### EgRendererElement.linkStrokeWidthProperty

#### EgRendererElement.linkSourceMarkerShapeProperty

#### EgRendererElement.linkSourceMarkerSizeProperty

#### EgRendererElement.linkTargetMarkerShapeProperty

#### EgRendererElement.linkTargetMarkerSizeProperty

#### EgRendererElement.linkLabelProperty

#### EgRendererElement.linkLabelFillColorProperty

#### EgRendererElement.linkLabelFillOpacityProperty

#### EgRendererElement.linkLabelStrokeColorProperty

#### EgRendererElement.linkLabelStrokeOpacityProperty

#### EgRendererElement.linkLabelStrokeWidthProperty

#### EgRendererElement.defaultNodeX

#### EgRendererElement.defaultNodeY

#### EgRendererElement.defaultNodeWidth

#### EgRendererElement.defaultNodeHeight

#### EgRendererElement.defaultNodeFillColor

#### EgRendererElement.defaultNodeFillOpacity

#### EgRendererElement.defaultNodeStrokeColor

#### EgRendererElement.defaultNodeStrokeOpacity

#### EgRendererElement.defaultNodeStrokeWidth

#### EgRendererElement.defaultNodeType

#### EgRendererElement.defaultNodeLabel

#### EgRendererElement.defaultNodeLabelFillColor

#### EgRendererElement.defaultNodeLabelFillOpacity

#### EgRendererElement.defaultNodeLabelStrokeColor

#### EgRendererElement.defaultNodeLabelStrokeOpacity

#### EgRendererElement.defaultNodeLabelStrokeWidth

#### EgRendererElement.defaultLinkStrokeColor

#### EgRendererElement.defaultLinkStrokeOpacity

#### EgRendererElement.defaultLinkStrokeWidth

#### EgRendererElement.defaultLinkSourceMarkerShape

#### EgRendererElement.defaultLinkSourceMarkerSize

#### EgRendererElement.defaultLinkTargetMarkerShape

#### EgRendererElement.defaultLinkTargetMarkerSize

#### EgRendererElement.defaultLinkLabel

#### EgRendererElement.defaultLinkLabelFillColor

#### EgRendererElement.defaultLinkLabelFillOpacity

#### EgRendererElement.defaultLinkLabelStrokeColor

#### EgRendererElement.defaultLinkLabelStrokeOpacity

#### EgRendererElement.defaultLinkLabelStrokeWidth

### Methods

#### EgRendererElement.load()

#### EgRendererElement.center()

#### EgRendererElement.update()
