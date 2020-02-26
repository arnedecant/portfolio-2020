// -------------------------------------------------------------------
// :: Proximity Component
// -------------------------------------------------------------------

import Component from '../base/component'

export default class Proximity extends Component {

    constructor(selector) {

        super(selector)

        this.rect = this.element.getBoundingClientRect()
        this.center = {
            x: this.rect.x + (this.rect.width / 2),
            y: this.rect.y + (this.rect.height / 2)
        }

        this.radius = this.rect.width / 2

    }

    mousemove(e) {

        // This event is fired from App as we don't want 
        // multiple events if there are multiple Proximity 
        // components in the document body

        const dx = e.clientX - this.center.x
        const dy = e.clientY - this.center.y
        this.distance = Math.sqrt(dx * dx + dy * dy)
        this.proximity = this.radius / distance

        this.element.style.setProperty("--distance", this.distance)
        this.element.style.setProperty("--proximity", this.proximity)

    }

}