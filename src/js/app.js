// -------------------------------------------------------------------
// :: App
// -------------------------------------------------------------------

import ProximityButton from './components/proximity-button'
import Picture from './components/picture'

import Engine from './engine'
import Instance from './instance'
import { getArrayWithNoise } from './utilities/array'
import { capitalize } from './utilities/string'
import { hcfp } from './utilities/three'

const CLASSES = { ProximityButton, Picture }

class App {

	constructor() {

		// create new engine: setup scene, camera & lighting
		// and load vertex and fragment shaders in memory

		window.ENGINE = new Engine()
		window.SHADERS = {
			vertex: document.querySelector('[data-shader="vertex"]').textContent,
			fragment: document.querySelector('[data-shader="fragment"]').textContent
		}

		// elements

		this.$sections = [...document.querySelectorAll('section:not(.hero)')]
		this.$hero = document.querySelector('section.hero')
		this.$components = [...document.querySelectorAll('[data-component]')]

		// properties
		
		this.instances = []
		this.components = {}

		// events

		window.addEventListener('resize', this.resize.bind(this), false)
		window.addEventListener('mousemove', this.mousemove.bind(this))
		document.body.addEventListener('click', this.click.bind(this))

		// setup all components

		this.$components.forEach(($component) => this.setupComponent($component))

		// init

		this.init()

	}

	async fetch(path = 'assets/data.json') {

		const data = await fetch(path)
		return await data.json()

	}

	async init() {
		
		this.data = await this.fetch()

		this.createInstances()
		this.scrollUpdates()

		this.components['proximity-button'].forEach((c) => c.setInstance(this.instances[this.instances.length - 1]))

		requestAnimationFrame(() => {
			window.scrollTo(0, 0)
			this.resize()
			this.$hero.style.opacity = 1
		})

	}

	setupComponent($component) {

		// Dynamically create new component instances from data-attributes
		// e.g. [data-component="my-component"]

		let component = name = $component.dataset.component

		// "my-component" => "MyComponent"

		component = component.split('-')
		component = component.map((c) => capitalize(c))
		component = component.join('')

		// add a new MyComponent($component) to the components object
		// this.components['my-component'] to get the desired components array

		if (!this.components[name]) this.components[name] = []
		this.components[name].push(new CLASSES[component]($component))

	}

	createInstances() {

		for (const instance of this.data.instances) {

			const points = instance.points.map((point) => () => getArrayWithNoise(...point))

			const props = {
				...instance,
				geometry: new THREE[instance.geometry.type](...instance.geometry.parameters),
				material: new THREE[instance.material.type]({
					...instance.material.parameters,
					emissive: hcfp(instance.material.parameters.emissive)
				}),
				points: points
			}
			
			this.instances.push(new Instance(props))

		}

	}

	scrollUpdates() {

		uos(0, 0.05, p => this.$hero.style.opacity = 1 - p);
		uos(0, 1, p => this.render());

		const step = 1 / this.instances.length

		for (let i = 0; i < this.instances.length; i += 1) {

			const transitionBegin = i * step
			const transitionEnd = transitionBegin + step * 0.5
			const textEnd = (i + 1) * step
			const $section = this.$sections[i]

			uos(transitionBegin, transitionEnd, p => (this.instances[i].phenomenon.uniforms.time.value = p))

			uos(transitionEnd, textEnd, p => {

				let opacity = 0
				let np = p * 2.0 - 1.0
				np = 1.0 - np * np

				if (i === this.instances.length - 1) opacity =  p * 1.5
				else opacity = np * 1.5

				$section.style.opacity = opacity

				if (opacity > 0) {
					this.$sections.forEach(($s) => ($s != $section) && $s.classList.remove('active'))
					$section.classList.add('active')
				}

			})
		}

	}

	resize(e) {

		// Set section heights

		for (const $section of this.$sections) {

			$section.style.height = window.innerHeight + 'px'

		}

		// Resize engine

		ENGINE.resize()

		// Render

		this.render()

	}

	mousemove(e) {

		if (!this.components['proximity-button']) return
		this.components['proximity-button'].forEach((component) => component.mousemove(e))

	}

	click(e) {

		

	}

	render(timestamp) {

        // render ENGINE

		ENGINE.render()

		// add self to the requestAnimationFrame

		// window.requestAnimationFrame(this.render.bind(this))

	}

}

export default new App()
