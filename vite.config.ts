import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    commonjsOptions: {
      include: ["tailwind.config.js", "node_modules/**"],
    },
    chunkSizeWarningLimit: 1500,
  },
  optimizeDeps: {
    include: ["tailwind-config"],
  },
  plugins: [
    vue({
      reactivityTransform: false,
    })
  ],
  resolve: {
    alias: {
      "tailwind-config": path.resolve(__dirname, "./tailwind.config.js"),
      '@': path.resolve(__dirname, './src'),
    },
  },
})
