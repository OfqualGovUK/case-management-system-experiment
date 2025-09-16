import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    manifest: true,
    outDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/js/main.js'),
        styles: resolve(__dirname, 'src/scss/main.scss')
      },
      output: {
        // Simpler, predictable filenames for Drupal libraries.
        // (If you prefer hashed files, remove these fileName rules and
        // keep the libraries.yml paths generic with globbing via the Vite module.)
        entryFileNames: 'main.js',
        assetFileNames: (chunk) => {
          if (chunk.name && chunk.name.endsWith('.css')) return 'style.css';
          if (chunk.name === 'styles.css') return 'style.css';
          return '[name][extname]';
        }
      }
    }
  }
});
