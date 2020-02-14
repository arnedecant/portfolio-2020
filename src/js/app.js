// -------------------------------------------------------------------
// :: App
// -------------------------------------------------------------------

import Engine from './engine.js'
import Instance from './instance.js'
import { getArrayWithNoise } from './utilities/array.js'
import { hcfp } from './utilities/three.js'

class App {

	constructor() {

		// elements

		this.$sections = document.querySelectorAll('section:not(.hero)');
		this.$hero = document.querySelector('section.hero');

		// properties

		this.shaders = {
			vertex: document.querySelector('[data-shader="vertex"]').textContent,
			fragment: document.querySelector('[data-shader="fragment"]').textContent
		}
		
		this.instances = []

		// create new engine: setup scene, camera & lighting

		window.ENGINE = new Engine()

		// events

		window.addEventListener('resize', this.resize.bind(this), false)
		document.body.addEventListener('click', this.click.bind(this))

		// init

		this.init()

	}

	async getData(path) {
		const data = await fetch('assets/data.json')
		return await data.json()
	}

	async init() {
		
		this.data = await this.getData()

		for (const instance of this.data.instances) {

			const props = {
				...instance,
				geometry: new THREE[instance.geometry.type](...instance.geometry.parameters),
				material: new THREE[instance.material.type]({
					...instance.material.parameters,
					emissive: hcfp(instance.material.parameters.emissive)
				}),
				points: [
					() => getArrayWithNoise(...instance.points[0]),
					() => getArrayWithNoise(...instance.points[1]),
					() => getArrayWithNoise(...instance.points[2]),
					() => getArrayWithNoise(...instance.points[3])
				]
			}
			
			this.instances.push(new Instance(props))

		}

		uos(0, 0.05, p => this.$hero.style.opacity = 1 - p);
		uos(0, 1, p => this.render());

		const step = 1 / this.instances.length;
		for (let i = 0; i < this.instances.length; i += 1) {
		const transitionBegin = i * step;
		const transitionEnd = transitionBegin + step * 0.5;
		const textEnd = (i + 1) * step;
		uos(transitionBegin, transitionEnd, p => (this.instances[i].phenomenon.uniforms.time.value = p));
		uos(transitionEnd, textEnd, p => {
			let np = p * 2.0 - 1.0;
			np = 1.0 - np * np;
			this.$sections[i].style.opacity = i === this.instances.length - 1 ? p * 1.5 : np * 1.5;
		});
		}

		requestAnimationFrame(() => {
			window.scrollTo(0, 0);
			this.resize();
			this.$hero.style.opacity = 1;
		});

	}

	eval(exp) {

		

	}

	resize(e) {

		// Set section heights

		for (const $section of this.$sections) $section.style.height = `${window.innerHeight}px`

		// Resize engine

		ENGINE.resize()

		// Render

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

		// window.requestAnimationFrame(this.render.bind(this))

	}

}

export default new App()
