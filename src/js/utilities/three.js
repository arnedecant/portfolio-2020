'use strict'

export const shadow = (subject, opacity) => {
	
	let material = new THREE.ShadowMaterial({opacity: opacity})
	let mesh = new THREE.Mesh(subject.geometry, material)
	
	// mesh.position.set({...subject.position})
	mesh.position.set(subject.position.x, subject.position.y, subject.position.z)
	mesh.receiveShadow = true
	
	return mesh

}
