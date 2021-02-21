import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import externalGlobals from "rollup-plugin-external-globals"

const banner = `/*! 
 * Metro 4 Definitions for RenderJS - Create html page in pure js
 * https://pimenov.com.ua
 *
 * Copyright 2021 Serhii Pimenov
 * Released under the MIT license
 */
`

export default {
    input: `./src/browser.js`,
    output: {
        file: `./lib/metro4-for-render.js`,
        format: 'iife',
        name: "",
        globals: "",
        sourcemap: false,
        banner: banner,
        exports: 'named',
    },
    plugins: [
        babel(),
        resolve(),
        commonjs(),
        externalGlobals({
            "@olton/renderjs": "html"
        })
    ],
}