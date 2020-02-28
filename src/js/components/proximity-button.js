// -------------------------------------------------------------------
// :: Proximity Button Component
// -------------------------------------------------------------------

import Proximity from './proximity'
import Engine from '../engine'
import { clamp } from '../utilities/math'

export default class ProximityButton extends Proximity {

    constructor(selector) {

        super(selector)

        this.engine = new Engine({ container: this.element, size: 3 })

        this.render()

    }

    setInstance(instance) {

        this.instance = instance

        this.engine.scene.add(this.instance.phenomenon.mesh)
        this.engine.resize()

    }

    render(timestamp) {

		// add self to the requestAnimationFrame

        window.requestAnimationFrame(this.render.bind(this))
        
        // skip if there's no instance defined

        if (!this.instance) return

        // resize engine

        this.engine.resize()

        // set uniforms according to proximity

        if (proximity <= 0) return

        let proximity = clamp(this.proximity, 0, 1)
        let scale = proximity * 2
        let time = Math.pow(proximity * 0.25, 0.25)

        this.instance.phenomenon.uniforms.time.value = time
        this.instance.phenomenon.mesh.scale.set(scale, scale, scale)

	}

}