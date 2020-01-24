// -------------------------------------------------------------------
// :: Engine
// -------------------------------------------------------------------

import * as THREE from 'three'

export default class Engine {

	constructor(config = {}) {

		// set properties

		this.config = config
		
		this.mouse = new THREE.Vector2()
		this.raycaster = new THREE.Raycaster()

		// init

		this.init()

	}

	init() {

		// set up scene, camera and renderer

		this.createScene()

		// add events

		window.addEventListener('resize', this.resize.bind(this), false)
		window.addEventListener('click', this.click.bind(this), false)
		window.addEventListener('mousemove', this.mousemove.bind(this), false)
		window.addEventListener('mousedown', this.mousedown.bind(this), false)
		window.addEventListener('mouseup', this.mouseup.bind(this), false)
		window.addEventListener('mousewheel', this.scroll.bind(this), { passive: true })

		// render

		this.render()

	}

	createScene() {

		this.$canvas = document.createElement('canvas')
		this.ctx = this.$canvas.getContext('2d')

		// set width & height

		this.height = window.innerHeight
		this.width = window.innerWidth

		// create new scene

		this.scene = window.SCENE = new THREE.Scene()

		// add fog to the scene

		this.scene.fog = new THREE.Fog(0xf7d9aa, 100, 950)

		// create the renderer

		this.createRenderer()

		// create the camera

		this.createCamera()

		// add lights

		this.createLights()

		// add debug helpers

		if (this.config.debug) this.debug()

	}

	debug() {

		let axesHelper = new THREE.AxesHelper(50)
		this.scene.add(axesHelper)

		let gridHelper = new THREE.GridHelper(1000, 1000, 0x3f3f3f, 0x3f3f3f)
		this.scene.add(gridHelper)

	}

	createCamera() {

		// set values to init the camera

		this.aspectRatio = this.width / this.height
		this.fieldOfView = 45
		this.nearPlane = 0.1
		this.farPlane = 10000

		// create a new camera

		this.camera = new THREE.PerspectiveCamera(
			this.fieldOfView,
			this.aspectRatio,
			this.nearPlane,
			this.farPlane
		)

		const z = Math.min(window.innerWidth, window.innerHeight);
		this.camera.position.set(0, 0, 700);

		// point the camera to the center

		this.camera.lookAt(new THREE.Vector3(0,0,0))

	}

	createRenderer() {

		// create new renderer

		this.renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true
		})

		// set the size

		this.renderer.setSize(this.width, this.height)

		// enable shadowMap

		this.renderer.shadowMap.enabled = true

		// support for HDPI displays

		this.renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)

		// append to DOM

		this.container = document.querySelector('#world')
		this.container.appendChild(this.renderer.domElement)

	}

	createLights() {

		// create a new ambient light

		this.light = new THREE.AmbientLight(0xffffff, 0.5)

		// create a new shadow light

		this.shadowLight = new THREE.DirectionalLight(0xffffff, 0.5)
		this.shadowLight.position.set(200, 200, 200)
		this.shadowLight.castShadow = true

		// create a new back light

		this.backLight = new THREE.DirectionalLight(0xffffff, 0.2)
		this.backLight.position.set(-100, 200, 50)
		this.backLight.castShadow = true

		// add lights to the scene

		this.scene.add(this.light)
		// this.scene.add(this.shadowLight)
		// this.scene.add(this.backLight)

	}

	updateZoom(axis = 'y') {

		// no need to zoom when scrollSpeed hasn't been updated

		if (this.scrollSpeed == 0) return

		// zoom per frame

		let zpf = this.config.camera.zpf

		// min & max values

		let min = this.config.camera.min[axis],
			max = this.config.camera.max[axis]

		// smoother scrolling at the end of the animation
		// prevents zooms very small values, for example 1.2 ...

		if (Math.abs(this.scrollSpeed) < (2 * zpf)) {
			zpf = zpf / 2
		}

		// redefine the zoom per frame

		if (this.scrollSpeed > 0) {

			// zoom out

			if (this.scrollSpeed < zpf) {
				zpf = this.scrollSpeed
				this.scrollSpeed = 0
			} else {
				this.scrollSpeed -= zpf
			}

		} else if (this.scrollSpeed < 0) {

			// zoom in

			if (this.scrollSpeed > -zpf) {
				zpf = this.scrollSpeed
				this.scrollSpeed = 0
			} else {
				this.scrollSpeed += zpf
				zpf = -zpf
			}

		}

		// get new z-pos

		let pos = this.camera.position[axis] - zpf

		// set boundaries for z-pos

		pos = (pos > min) ? pos : min
		pos = (pos < max) ? pos : max

		// apply position if it's above threshold

		this.camera.position[axis] = pos

		// update controls

		// if (this.controls) this.controls.update()

	}

	scroll(e) {

		// only store the scroll value
		// zoom will be handled in the render function

		this.scrollSpeed = e.deltaY / 2

	}

	click(e) {

		e.preventDefault()

	}

	mousemove(e) {

		e.preventDefault()

		// calculate mouse position in normalized device coordinates
		// (-1 to +1) for both components

		this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
		this.mouse.y = - (e.clientY / window.innerHeight) * 2 + 1

		// console.log({ x: this.mouse.x, y: this.mouse.y })

	}

	mousedown(e) {

		

	}

	mouseup(e) {

		

	}

	resize(e) {

		// set canvas dimensions

		this.width = window.innerWidth;
		this.height = window.innerHeight;

		// set renderer dimensions

		this.renderer.setSize(this.width, this.height)

		// set camera

		this.aspectRatio = this.width / this.height
		this.camera.aspect = this.aspectRatio
		this.camera.updateProjectionMatrix()

		// render

		// this.render()

	}

	add(mesh) { this.scene.add(mesh) }
	remove(mesh) { this.scene.remove(mesh) }

	render() {

		// update zoom

		// this.updateZoom()
		if (this.controls) this.controls.update()

		// render

  		this.renderer.render(this.scene, this.camera)

	}

}
