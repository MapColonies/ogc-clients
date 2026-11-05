import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import { name, version, main, module, browser, author } from './package.json';

const isProduction = process.env.NODE_ENV === 'production';

// Runtime dependencies (mc-utils, js-logger, zod, fast-xml-parser, ...) are resolved from the
// consumer's node_modules rather than bundled: mc-utils re-exports its submodules via dynamic
// CJS helpers that the commonjs plugin cannot statically analyze into named exports.
const external = (id) => !id.startsWith('.') && !path.isAbsolute(id);

export default {
  input: './src/index.ts',
  external,
  output: [
    {
      file: main,
      name: main,
      format: 'cjs',
      plugins: [isProduction && terser()],
    },
    {
      file: module,
      name: name,
      format: 'es',
    },
    {
      file: browser,
      name: name,
      format: 'umd',
    },
  ],

  plugins: [
    json(),
    resolve({
      jsnext: true,
      main: true,
    }),
    typescript({
      typescript: require('typescript'),
      rollupCommonJSResolveHack: false,
      clean: true,
    }),
    commonjs({
      exclude: 'node_modules/lodash/**',
      include: 'node_modules/**',
      extensions: ['.js'],
      ignoreGlobal: false,
      sourceMap: false,
    }),
  ],
};
