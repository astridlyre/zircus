import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "assets/js/index.js",
  output: {
    file: "assets/js/bundle.js",
    format: "esm",
  },
  plugins: [
    resolve(),
    commonjs(),
    terser(),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      presets: [
        [
          "@babel/preset-env",
          {
            corejs: "3.16.1",
            useBuiltIns: "usage",
            targets: "> 5% in CA and last 2 versions",
          },
        ],
      ],
    }),
  ],
};
