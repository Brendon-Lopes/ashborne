import { build } from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

await build({
  entryPoints: ['src/main.tsx'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outdir: 'dist',
  sourcemap: true,
  external: [
    'ink',
    'react',
    'react-dom',
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
    'chalk',
    'figures',
    'inkjs',
  ],
  alias: {
    '@shared': path.resolve(__dirname, 'src/shared'),
    '@engine': path.resolve(__dirname, 'src/engine'),
    '@infra': path.resolve(__dirname, 'src/infrastructure'),
    '@ui': path.resolve(__dirname, 'src/ui'),
    '@config': path.resolve(__dirname, 'src/config'),
    '@utils': path.resolve(__dirname, 'src/utils'),
  },
});

console.log('Build complete.');
