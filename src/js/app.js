// -------------------------------------------------------------------
// :: App
// -------------------------------------------------------------------

import * as THREE from 'three'
import Engine from './Engine.js'

class App {

	constructor() {

		// elements

		this.$video = document.querySelector('#video')
		this.$canvas = document.createElement('canvas')

		// properties

		this.shaders = {
			vertex: document.querySelector('[data-shader="vertex"]').textContent,
			fragment: document.querySelector('[data-shader="fragment"]').textContent
		}

		// create new engine: setup scene, camera & lighting

		window.ENGINE = new Engine()

		// events

		document.body.addEventListener('click', this.click.bind(this))

		// init

		this.init()

	}

	init() {

		ENGINE.scene.background = new THREE.Color(0x222222)

		// render

		this.render()

	}

	click(e) {

		

	}

	render(timestamp) {

        // render ENGINE

		ENGINE.render()
		
		// Do stuff

		// TODO ...

		// add self to the requestAnimationFrame

		window.requestAnimationFrame(this.render.bind(this))

	}

}

export default new App()
