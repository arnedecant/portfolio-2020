'use strict'

export const getArrayWithNoise = (array, noise) => {
    return array.map(item => item + getRandomBetween(noise));
}

Array.prototype.noise = () => getArrayWithNoise(this)