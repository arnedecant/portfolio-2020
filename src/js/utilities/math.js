'use strict'

export const random = (v0, v1) => {

	if (Array.isArray(min)) return min[Math.floor(Math.random() * min.length)]

	if (!max) {
		min = 0 - min
		max = min
	}

	return Math.random() * (max - min) + min

}

export const normalize = (v, vmin, vmax, tmin, tmax) => {

	let nv = Math.max(Math.min(v, vmax), vmin)
	let dv = vmax - vmin
	let pc = (nv - vmin) / dv
	let dt = tmax - tmin
	let tv = tmin + (pc * dt)

	return tv;

}

export const clamp = (value, min, max) => {

	if (value < min) return min
	if (value > max) return max
	
	return value

}

export const lerp = (v0, v1, t) => {

	return v0 * (1 - t) + v1 * t
	
}

Array.prototype.random = () => random(this)
Number.prototype.normalize = (vmin, vmax, tmin, tmax) => normalize(this, vmin, vmax, tmin, tmax)
Number.prototype.clamp = (min, max) => clamp(this, min, max)