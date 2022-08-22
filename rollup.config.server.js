import typescript from '@rollup/plugin-typescript'
import externals from 'rollup-plugin-node-externals'

export default {
  input: 'src/index.ts',
  output: {
    file: 'build/index.js',
    format: 'cjs',
    sourcemap: true,
    plugins: []
  },
  plugins: [
    typescript(),
    externals()
  ]
}
