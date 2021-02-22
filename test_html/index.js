import {div, h1, h2, li, p, render, span, ul} from "@olton/renderjs"
import {
    accordion,
    accordionFrame,
    actionButton,
    actionButtonAction,
    actionButtonActions,
    activity,
    activityBars,
    appBar,
    appBarBrand,
    appBarContainer,
    appBarItem,
    appBarMenu,
    appBarMenuItem,
    cell,
    container,
    containerFluid,
    grid,
    multiActionButton,
    row
} from "../src"

const model = [
    containerFluid(
        container([
            h1("Metro 4 for RenderJS", {className: 'text-center'}),

            div([
                    h2("Accordion"),
                    accordion([
                        accordionFrame("Frame1", [
                            p('Paragraph 1'),
                            p('Paragraph 2'),
                            p('Paragraph 3'),
                        ]),
                        accordionFrame("Frame2", "lorem2", {className: "active"}),
                        accordionFrame("Frame3", "lorem3"),
                    ])
                ]
            , {className: "mt-10"}),

            div(
                [
                    h2("Action button"),
                    actionButton(span({className: "mif-plus"})),
                    multiActionButton([
                        actionButton(span({className: "mif-plus"}), {
                            className: "rotate-minus success",

                            events: {
                                onclick: "$(this).toggleClass('active')"
                            }
                        }),
                        actionButtonActions([
                            actionButtonAction('#', span({className: "mif-user-plus"})),
                            actionButtonAction('#', span({className: "mif-library"})),
                            actionButtonAction('#', span({className: "mif-alarm"})),
                            actionButtonAction('#', span({className: "mif-lock"})),
                        ], {className: "drop-right"})
                    ])
                ], {className: "mt-10"}
            ),

            div(
                [
                    h2("Activities"),
                    div([
                        activity(),
                        activity('atom'),
                        activityBars()
                    ], {className: "d-flex"})
                ], {className: "mt-10"}
            ),

            div([
                h2("Grid"),
                grid(
                    row([
                        cell("Cell-1", {className: "cell-lg-3 cell-md-6"}),
                        cell("Cell-2", {className: "cell-lg-3 cell-md-6"}),
                        cell("Cell-3", {className: "cell-lg-3 cell-md-6"}),
                        cell("Cell-4", {className: "cell-lg-3 cell-md-6"}),
                    ])
                )
            ], {className: "mt-10"}),

            div([
                h2("AppBar"),
                appBar([
                    appBarBrand([
                        span("Metro 4 for RenderJS", {className: "enlarge-1"})
                    ], {href: "#"}),
                    appBarMenu([
                        appBarMenuItem("#", "Home"),
                        appBarMenuItem("#", "Products"),
                        appBarMenuItem("#", "Blog"),
                        appBarMenuItem("#", "Contacts"),
                    ]),
                    appBarContainer([
                        appBarItem("Sin In", {href: "#"}),
                        appBarItem("Sign Up", {href: "#"})
                    ], {className: "ml-auto"})
                ], {className: "pos-relative", data: {expandPoint: "md"}})
            ], {className: "mt-10"})
        ])
    )
]

render(model, document.querySelector("#app"))

