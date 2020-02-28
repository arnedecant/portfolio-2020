// -------------------------------------------------------------------
// :: Picture
// -------------------------------------------------------------------
// https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
// https://css-tricks.com/an-introduction-to-web-components/
//
// Note: apparently it is currently way too hard to implement web 
// components using a webpack and babel es2015 transpiler ...
// Todo: find a way to fix this or transpile for es6

import Component from "../base/component"

export default class Image extends Component {

    constructor(selector) {

        super(selector, true)

    }

    init() {

        this.src = this.element.dataset.src

        const $picture = this.$template.content.cloneNode(true)
        const $img = $picture.querySelector('img')

        $img.src = this.src

        this.element.appendChild($picture)

    }

}