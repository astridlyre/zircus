import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

export default {
    input: 'assets/js/index.js',
    output: {
        file: 'assets/js/bundle.js',
        format: 'iife',
    },
    plugins: [resolve(), terser()],
}
