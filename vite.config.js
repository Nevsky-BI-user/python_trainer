import { defineConfig } from 'vite';

const IGNORED = ['**/.claude/**', '**/.local/**', '**/.pyodide-cache/**'];

export default defineConfig({
  // Відносна база: зібраний застосунок працює з будь-якої теки чи підшляху.
  base: './',
  worker: { format: 'es' },
  server: { watch: { ignored: IGNORED } },
  build: { target: 'es2022', chunkSizeWarningLimit: 900 },
  test: {
    include: ['tests/**/*.test.js'],
    exclude: ['node_modules/**', ...IGNORED],
  },
});
