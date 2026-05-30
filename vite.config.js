import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 5188,
    strictPort: true,
  },
  plugins: [
    {
      name: 'html-rewrite',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = new URL(req.url, `http://${req.headers.host}`);
          const pathname = url.pathname;
          
          if (pathname === '/home') {
            req.url = '/index.html';
          } else if (pathname === '/strategy') {
            req.url = '/strategy.html';
          } else if (pathname === '/services') {
            req.url = '/services.html';
          } else if (pathname === '/methodology') {
            req.url = '/methodology.html';
          }
          next();
        });
      }
    }
  ],
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
