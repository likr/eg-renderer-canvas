import {layout} from './layout'

const egRendererTagName = 'eg-renderer'

window.customElements.whenDefined(egRendererTagName).then(() => {
  const EgRendererElement = window.customElements.get(egRendererTagName)

  class EgRendererOGDFElement extends EgRendererElement {
    static get observedAttributes () {
      const attributes = [
        'layout-method',
        'fmmm-unit-edge-length'
      ]
      return attributes.concat(EgRendererElement.observedAttributes)
    }

    attributeChangedCallback (attr, oldValue, newValue) {
      switch (attr) {
        default:
          super.attributeChangedCallback(attr, oldValue, newValue)
      }
    }

    onLayout (data, preservePos) {
      if (preservePos) {
        return
      }
      layout(this, data)
    }

    get layoutMethod () {
      if (!this.hasAttribute('layout-method')) {
        return 'fmmm'
      }
      return this.getAttribute('layout-method')
    }

    set layoutMethod (value) {
      this.setAttribute('layout-method', value)
    }

    get fmmmUnitEdgeLength () {
      if (!this.hasAttribute('fmmm-unit-edge-length')) {
        return 20
      }
      return +this.getAttribute('fmmm-unit-edge-length')
    }

    set fmmmUnitEdgeLength (value) {
      this.setAttribute('fmmm-unit-edge-length', value)
    }
  }

  window.customElements.define('eg-renderer-ogdf', EgRendererOGDFElement)
})
