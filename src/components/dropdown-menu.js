import {List} from "@olton/renderjs";
import {addClasses, addRole} from "../helpers";

export class DropdownMenu extends List {
    constructor(children = '', options = {}) {
        const className = addClasses('d-menu', options.className)
        const _options = addRole('dropdown', options)
        super('ul', children, {..._options, className});
    }
}

export const dropdownMenu = (children, options) => new DropdownMenu(children, options)