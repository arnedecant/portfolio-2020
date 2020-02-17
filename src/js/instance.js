// -------------------------------------------------------------------
// :: App
// -------------------------------------------------------------------

export default class Instance {

	constructor({ geometry, material, multiplier, duration, points, rainbow = false }) {

		const url = new URL(window.location.href)

        this.geometry = geometry
        this.material = material
        this.multiplier = multiplier
        this.duration = duration
        this.points = points
		this.rainbow = rainbow || parseFloat(url.searchParams.get('rainbow'))

        this.uniforms = { 
			time: { value: 0 },
			PI: { value: Math.PI },
			duration: { value: this.duration },
			rainbow: { value: this.rainbow ? 1 : 0 }
		}

        this.attributes = [
            {
              name: 'aPositionStart',
              data: this.points[0],
              size: 3,
            },
            {
              name: 'aControlPointOne',
              data: this.points[1],
              size: 3,
            },
            {
              name: 'aControlPointTwo',
              data: this.points[2],
              size: 3,
            },
            {
              name: 'aPositionEnd',
              data: this.points[3],
              size: 3,
            },
            {
              name: 'aOffset',
              data: i => [i * ((1 - this.duration) / (this.multiplier - 1))],
              size: 1,
            }
        ]

		// init

		this.init()

	}

	init() {
        
        this.fragment = []

        if (this.rainbow) {

            this.attributes.push({
				name: 'aColor',
				data: (i, total) => {
					const color = new THREE.Color()
					color.setHSL(i / total, 0.6, 0.7)
					return [color.r, color.g, color.b]
				},
				size: 3,
            })

            this.fragment = [
                ['#define PHONG', 'varying vec3 vColor;'],
                ['vec4( diffuse, opacity )', 'vec4( vColor, opacity )'],
                ['vec3 totalEmissiveRadiance = emissive;', 'vec3 totalEmissiveRadiance = vColor;'],
			]

		}
          
        this.phenomenon = new THREE.Phenomenon({
            attributes: this.attributes,
            uniforms: this.uniforms,
            vertex: SHADERS.vertex,
            geometry: this.geometry,
            multiplier: this.multiplier,
            material: this.material,
            fragment: this.fragment,
        })

        ENGINE.scene.add(this.phenomenon.mesh)
		
	}

}
