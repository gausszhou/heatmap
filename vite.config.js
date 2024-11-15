// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: "build",
    lib: {
      entry: resolve(__dirname, 'src/index'),
      name: 'h337',
      fileName: (format, entryName) => {
        if (format === 'es') {
          return 'heatmap.mjs'
        }
        if (format === 'umd') {
          return 'heatmap.js'
        }
      },
      formats: ["es", "umd"],
    },
  },
})