import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from https://plant900.github.io/photo-tagging-game/
export default defineConfig({
  base: '/photo-tagging-game/',
  plugins: [react()],
})
