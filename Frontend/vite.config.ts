import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    host: true, // Necesario para que Docker exponga el puerto
    port: 5173, 
    watch: {
      usePolling: true, // 👈 Esta es la clave para que escuche cambios en Docker
    }
  }
})
