import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/my-react-ts/',
  server: {
    port: 5173,       // paksa port 5173
    strictPort: true, // error jika port 5173 sudah dipakai
  },
})
