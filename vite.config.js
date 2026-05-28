import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 5188,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        strategy: resolve(__dirname, 'strategy.html'),
        services: resolve(__dirname, 'services.html'),
        methodology: resolve(__dirname, 'methodology.html'),
      },
    },
  },
});
