import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  // TAMBAHKAN BLOK SERVER INI:
  server: {
    port: 5173,
    strictPort: true, // Memaksa Vite tetap di port 5173 atau gagal jika port dipakai
    cors: true,
  },
})