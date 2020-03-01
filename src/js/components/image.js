// -------------------------------------------------------------------
// :: Picture
// -------------------------------------------------------------------
// https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
// https://css-tricks.com/an-introduction-to-web-components/
//
// Note: apparently it is currently way too hard to implement web 
// components using a webpack and babel es2015 transpiler ...
// Todo: find a way to fix this or transpile for es6

import Component from "../base/component"
import Engine from "../engine"
import { hcfp } from '../utilities/three'

export default class Image extends Component {

    constructor(selector, data) {

        super(selector)

        this.data = data

        this.init()

    }

    init() {

        this.src = this.element.dataset.src
        this.context = this.element.dataset.context || '2d'

        switch (this.context.toLowerCase()) {
            case '3d': return this.init3D()
            default: return this.init2D()
        }

    }

    init2D() {

        const $picture = this.$template.content.cloneNode(true)
        const $img = $picture.querySelector('img')

        $img.src = this.src

        this.element.appendChild($picture)

    }

    init3D() {

        const engine = new Engine({ container: this.element })

        const geometry = new THREE[this.data.geometry.type](...this.data.geometry.parameters)
        const material = new THREE[this.data.material.type]({
            ...this.data.material.parameters,
            emissive: hcfp(this.data.material.parameters.emissive)
        })

        const mesh = new THREE.Mesh(geometry, material)

        engine.scene.add(mesh)

    }

}