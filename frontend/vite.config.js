import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import mkcert from 'vite-plugin-mkcert'
import path from 'path';
import { fileURLToPath } from 'url';
// Convert __dirname to a path that works with ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));


export default defineConfig({
  server: { https: true },
  plugins: [vue(), mkcert()],
  resolve: {
    alias: {
      
      '@': path.resolve(__dirname, './src'),
    },
  },
});
