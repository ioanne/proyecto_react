import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Firebase por sí solo supera el límite por defecto de 500 kB.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          bootstrap: ['react-bootstrap', 'bootstrap'],
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
