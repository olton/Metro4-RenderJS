import {h1, p, render} from "@olton/renderjs"
import {accordion, accordionFrame, container, containerFluid} from "../src"

const model = [
    containerFluid(
        container([
            h1("Metro 4 for RenderJS", {className: 'text-center'}),
            accordion([
                accordionFrame("Frame1", [
                    p('Paragraph 1'),
                    p('Paragraph 2'),
                    p('Paragraph 3'),
                ]),
                accordionFrame("Frame2", "lorem2", {className: "active"}),
                accordionFrame("Frame3", "lorem3"),
            ])
        ])
    )
]

render(model, document.querySelector("#app"))

