import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import swc from 'rollup-plugin-swc';
import copy from 'rollup-plugin-copy';
import replace from 'rollup-plugin-replace';
import postcss from 'rollup-plugin-postcss';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import tailwindcss from 'tailwindcss';

const production = !process.env.ROLLUP_WATCH;
const outputDir = 'dist';

export default {
  input: 'src/index.js',
  output: {
    file: `${outputDir}/bundle.js`,
    format: 'iife',
  },
  plugins: [
    resolve(),
    postcss({
      plugins: [tailwindcss],
    }),
    swc({
      jsc: {
        parser: {
          syntax: 'ecmascript',
          jsx: true,
        },
        target: 'es2016',
      },
    }),
    commonjs(),
    production && terser(),
    copy({
      targets: [{ src: 'public/index.html', dest: outputDir }],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    !production &&
      serve({
        contentBase: outputDir,
        historyApiFallback: true,
      }),
    !production && livereload(outputDir),
  ],
};
