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

        this.engine = new Engine({ container: this.element })

        // get texture

        const texture = new THREE.TextureLoader().load(this.src)

        // setup mesh 

        const geometry = new THREE[this.data.geometry.type](5, 0)
        const material = new THREE[this.data.material.type]({
            ...this.data.material.parameters,
            emissive: hcfp(this.data.material.parameters.emissive),
            // map: texture
        })
        this.mesh = new THREE.Mesh(geometry, material)

        // setup projector

        this.engine.spotLight.map = texture

        // add to scene

        this.engine.scene.add(this.mesh)
        this.engine.resize()
        this.render()

    }

    render() {

        this.engine.render()

        // this.mesh.rotation.x += 0.0025
		this.mesh.rotation.y += 0.0025
        this.mesh.rotation.z += 0.0025

        window.requestAnimationFrame(this.render.bind(this))

    }

}