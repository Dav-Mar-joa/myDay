// esbuild.config.js
require('esbuild').build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  platform: 'node',
  external: ['express', 'cookie-parser', 'cors', 'bcryptjs', 'express-session', 'mongoose'], // on exclut les deps node
  target: ['node22'],
  color: true,

}).catch(() => process.exit(1));
