import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'

export default {
    input: 'assets/js/index.js',
    output: {
        file: 'bundle.js',
        format: 'iife',
    },
    plugins: [resolve(), babel({ babelHelpers: 'bundled' }), terser()],
}
