import React from 'react'
import {render} from 'react-dom'

export class Hello extends React.Component {
  render () {
    return <div>
      hello
    </div>
  }
}

document.registerElement('my-hello', class MyHello extends window.HTMLElement {
  createdCallback () {
    const mountPoint = document.createElement('span')
    this.createShadowRoot().appendChild(mountPoint)
    render(<Hello />, mountPoint)
  }
})
