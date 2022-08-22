import { terser } from 'rollup-plugin-terser'
import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import copy from 'rollup-plugin-copy'

export default {
  input: 'web/src/index.tsx',
  output: [{
    file: 'web/build/bundle.min.js',
    format: 'iife',
    sourcemap: true,
    plugins: [terser()]
  }, {
    file: 'web/build/bundle.js',
    format: 'iife',
    sourcemap: true,
    plugins: []
  }],
  plugins: [
    typescript({
      jsx: 'preserve',
      jsxImportSource: 'solid-js'
    }),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env', 'solid'],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }),
    nodeResolve(),
    copy({
      targets: [{ src: 'web/src/index.html', dest: 'web/build' }]
    })
  ]
}
