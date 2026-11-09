import { defineConfig } from 'vite';

const IGNORED = ['**/.claude/**', '**/.local/**', '**/.pyodide-cache/**'];

export default defineConfig({
  // Відносна база: зібраний застосунок працює з будь-якої теки чи підшляху.
  base: './',
  worker: { format: 'es' },
  server: { watch: { ignored: IGNORED } },
  // Половина основного чанка: текст курсу (src/content, ~540 кБ), каталог читає його весь на старті.
  build: { target: 'es2022', chunkSizeWarningLimit: 1100 },
  test: {
    include: ['tests/**/*.test.js'],
    exclude: ['node_modules/**', ...IGNORED],
  },
});
