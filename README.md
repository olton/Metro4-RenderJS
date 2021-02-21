# Welcome to Metro 4 definitions for RenderJS

RenderJS - is a library to create a site in pure JavaScript. The one contains functions to create html tags.
You can use RenderJS with Webpack, Parcel or other builders or directly for using in the browser with pre-build version.

## Using with Webpack, Parcel, ...

Create a simple index:
```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div id="app"></div>
    <script src="index.js"></script>
</body>
</html>
```

Add structure in model, and render it:
```javascript
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
```

### Browser mode
Also, you can use `render` directly
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="stylesheet" href="metro-all.css">
</head>
<body>
    <div id="app"></div>

    <script src="metro.js"></script>
    <script src="render.js"></script>
    <script src="metro4-for-render.js"></script>
    <script>
        (function(){
            html.registerGlobal();
            metroHtml.registerGlobal();

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

            render(model, document.querySelector('#app'));

            html.restoreGlobal();
            metroHtml.restoreGlobal();
        })()
    </script>
</body>
</html>
```
