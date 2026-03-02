import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/crickboss-testweb/' : '/',
  plugins: [react()],
}))
