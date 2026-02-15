import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    emptyOutDir: false, // Don't clear dist folder (server files are there)
  },
});
