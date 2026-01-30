import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/graphql-profile/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        profile: resolve(__dirname, 'profile.html')
      }
    }
  }
});
