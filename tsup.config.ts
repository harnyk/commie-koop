import {defineConfig} from 'tsup';

export default defineConfig({
  entry: ['src/main.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: 'lib',
  shims: false,
});
