import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(() => ({
  resolve: {
    conditions: ['@org/source'],
  },
  optimizeDeps: {
    exclude: ['ofetch'],
  },
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/client/web',
  server: {
    port: 4201,
    host: 'localhost',
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [vue(), tailwindcss()],
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}))
