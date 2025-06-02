import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'url';
// Convert __dirname to a path that works with ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));


export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      
      '@': path.resolve(__dirname, './src'),
    },
  },
});
