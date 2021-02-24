import {a, div, h1, h2, p, render, span} from "@olton/renderjs"
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
    menuItem,
    cell,
    container,
    containerFluid,
    grid,
    multiActionButton,
    row, dropdownMenu
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
                            menuItem('#', span({className: "mif-user-plus"})),
                            menuItem('#', span({className: "mif-library"})),
                            menuItem('#', span({className: "mif-alarm"})),
                            menuItem('#', span({className: "mif-lock"})),
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
                        menuItem("#", "Home"),
                        menuItem("#", [
                            a("Products", {className: "dropdown-toggle"}),
                            dropdownMenu([
                                menuItem("#", "Item 1"),
                                menuItem("#", "Item 2"),
                                menuItem("#", "Item 3"),
                                menuItem("#", "Item 4"),
                            ])
                        ]),
                        menuItem("#", "Blog"),
                        menuItem("#", "Contacts"),
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

