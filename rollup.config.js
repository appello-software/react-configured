import { exec } from 'child_process';
import glob from 'glob';
import path from 'path';
import { babel } from '@rollup/plugin-babel';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-ts';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';

import pkg from './package.json' assert { type: 'json' };

/** Custom rollup plugin to exec tsc-alias over the built files */
function tscAliasPlugin() {
  return {
    name: 'tsc-alias',
    writeBundle: () => {
      return new Promise((resolve, reject) => {
        exec('tsc-alias', function callback(error, stdout, stderr) {
          if (stderr || error) {
            reject(stderr || error);
          } else {
            resolve(stdout);
          }
        });
      });
    }
  };
}

/**
 * Plugin to watch extra files in rollup.js
 *
 * @param globs string[]
 */
function watcher(globs) {
  /** @type {import('rollup').Plugin} */
  const hook = {
    buildStart() {
      for (const item of globs) {
        glob.sync(path.resolve(item)).forEach((filename) => {
          this.addWatchFile(filename);
        });
      }
    }
  };
  return hook;
}

/** @type {import('rollup').RollupOptions} */
const buildConfig = {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true
    },
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    nodeResolve(),
    commonjs(),
    json(),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env'],
    }),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: true
    }),
    tscAliasPlugin(),
  ]
};

/** @type {import('rollup').RollupOptions} */
const browserConfig = {
  input: 'dist/index.js',
  output: [
    {
      file: pkg.unpkg,
      format: 'umd',
      name: 'react-configured',
    }
  ],
  plugins: [terser()]
};

export default [buildConfig, browserConfig];
