const { build } = require('esbuild')

build({
  define: { 'process.env.NODE_ENV': process.env.NODE_ENV },
  target: 'es2019',
  platform: 'browser',
  entryPoints: ['src/index.tsx'],
  outdir: 'dist',
  bundle: true,
  minify: !process.env.NODE_ENV,
  sourcemap: process.env.NODE_ENV,
}).catch(() => process.exit(1))
