import {Div} from "@olton/renderjs";
import {addClasses} from "../helpers";

export class Grid extends Div {
    constructor(type = 'grid', children = '', options = {}) {
        const className = addClasses(type, options.className)
        super(children, {...options, className})
    }
}

export const grid = (children, options) => new Grid('grid', children, options)
export const row = (children, options) => new Grid('row', children, options)
export const cell = (children, options) => new Grid('', children, options)