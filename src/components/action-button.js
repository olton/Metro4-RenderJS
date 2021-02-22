import {Button, Div, List, ListItem} from "@olton/renderjs"
import {addClasses} from "../helpers"

export class ActionButton extends Button {
    constructor(icon = '', options = {}) {
        const className = addClasses("action-button", options.className)
        super(icon, {...options, className})
    }

    template(content) {
        return `
            <${this.tag} ${this.attributes().join(" ")} ${this.events}>
                <span class="icon">${content}</span>            
            </${this.tag}>
        `
    }
}

export const actionButton = (icon = '', options = {}) => new ActionButton(icon, options)

export class MultiActionButton extends Div {
    constructor(children = '', options = {}) {
        const className = addClasses("multi-action", options.className)
        super(children, {...options, className})
    }
}

export const multiActionButton = (children = '', options = {}) => new MultiActionButton(children, options)

export class ActionButtonActions extends List {
    constructor(type = '', children = '', options = {}) {
        const className = addClasses("actions", options.className)
        super(type, children, {...options, className});
    }
}

export const actionButtonActions = (children = '', options = {}) => new ActionButtonActions('ul', children, options)

export class ActionButtonAction extends ListItem {
    constructor(href = '#', children = '', options = {}) {
        super(children, options)
        this.href = href
    }

    template(content) {
        return `
            <${this.tag} ${this.attributes().join(" ")} ${this.events}>
                <a href="${this.href}">${content}</a>            
            </${this.tag}>
        `
    }
}

export const actionButtonAction = (href = '#', children = '', options = {}) => new ActionButtonAction(href, children, options)
