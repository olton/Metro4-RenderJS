import {render} from "@olton/renderjs"
import {section} from "@olton/renderjs"
import {accordion, accordionFrame} from "../src"

const model = [
    accordion([
        accordionFrame("Frame1", "lorem1"),
        accordionFrame("Frame2", "lorem2", {className: "active"}),
        accordionFrame("Frame3", "lorem3"),
    ])
]

render(model, document.querySelector("#app"))

