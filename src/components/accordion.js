import {addRequiredClasses, Div} from "@olton/renderjs"
import {addRequiredRole} from "@olton/renderjs"

export class Accordion extends Div {
    constructor(children = '', options = {}) {
        super(children, addRequiredRole('accordion', options))
    }
}

export const accordion = (children = '', options = {}) => new Accordion(children, options)

export class AccordionFrame extends Div {
    constructor(title = '', children = '', options = {}) {
        const className = addRequiredClasses('frame', options.className)
        super(children, {...options, className})
        this.title = title
    }

    template(content){
        return `
            <${this.tag} ${this.attributes().join(" ")} ${this.events}>
                <div class="heading">${this.title}</div>
                <div class="content">${content}</div>
            </${this.tag}>
        `
    }
}

export const accordionFrame = (title = '', children = '', options = {}) => new AccordionFrame(title, children, options)
