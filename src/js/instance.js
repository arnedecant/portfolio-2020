// -------------------------------------------------------------------
// :: App
// -------------------------------------------------------------------

export default class Instance {

	constructor({ geometry, material, multiplier, duration, points, rainbow = false }) {

        this.geometry = geometry
        this.material = material
        this.multiplier = multiplier
        this.duration = duration
        this.points = points
        this.rainbow = rainbow

        this.uniforms = { time: { value: 0 } }
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

        this.vertex = `
		  attribute vec3 aPositionStart;
		  attribute vec3 aControlPointOne;
		  attribute vec3 aControlPointTwo;
		  attribute vec3 aPositionEnd;
		  attribute float aOffset;
		  uniform float time;
		  ${this.rainbow ? `attribute vec3 aColor; varying vec3 vColor;` : ``}
	  
		  float easeInOutSin(float t){
			return (1.0 + sin(${Math.PI} * t - ${Math.PI} / 2.0)) / 2.0;
		  }
	  
		  vec4 quatFromAxisAngle(vec3 axis, float angle) {
			float halfAngle = angle * 0.5;
			return vec4(axis.xyz * sin(halfAngle), cos(halfAngle));
		  }
	  
		  vec3 rotateVector(vec4 q, vec3 v) {
			return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
		  }
	  
		  vec3 bezier4(vec3 a, vec3 b, vec3 c, vec3 d, float t) {
			return mix(mix(mix(a, b, t), mix(b, c, t), t), mix(mix(b, c, t), mix(c, d, t), t), t);
		  }
	  
		  void main(){
			float tProgress = easeInOutSin(min(1.0, max(0.0, (time - aOffset)) / ${this.duration}));
			vec4 quatX = quatFromAxisAngle(vec3(1.0, 0.0, 0.0), -5.0 * tProgress);
			vec4 quatY = quatFromAxisAngle(vec3(0.0, 1.0, 0.0), -5.0 * tProgress);
			vec3 basePosition = rotateVector(quatX, rotateVector(quatY, position));
			vec3 newPosition = bezier4(aPositionStart, aControlPointOne, aControlPointTwo, aPositionEnd, tProgress);
			float scale = tProgress * 2.0 - 1.0;
			scale = 1.0 - scale * scale;
			basePosition *= scale;
			gl_Position = basePosition + newPosition;
			${this.rainbow ? `vColor = aColor;` : ``}
		  }
        `
        
        this.fragment = []

        if (this.rainbow) {

            this.attributes.push({
              name: 'aColor',
              data: (i, total) => {
                const color = new THREE.Color();
                color.setHSL(i / total, 0.6, 0.7);
                return [color.r, color.g, color.b];
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
            vertex: this.vertex,
            geometry: this.geometry,
            multiplier: this.multiplier,
            material: this.material,
            fragment: this.fragment,
        })

        ENGINE.scene.add(this.phenomenon.mesh)
		
	}

}
