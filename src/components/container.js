import {addRequiredClasses, addRequiredRole, Div} from "@olton/renderjs"

export class Container extends Div {
    constructor(type = '', children = '', options = {}) {
        const className = addRequiredClasses(type, options.className)
        super(children, {...options, className})
    }
}

export const containerFluid = (children = '', options = {}) => new Container('container-fluid', children, options)
export const container = (children = '', options = {}) => new Container('container', children, options)


