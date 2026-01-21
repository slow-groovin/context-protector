import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwind from '@tailwindcss/vite'
import sqlocal from 'sqlocal/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    tailwind(),
    sqlocal(),
    ...(mode === 'single' ? [viteSingleFile()] : []),
    ...(mode !== 'single' ? [VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Context Protector',
        short_name: 'Context Protector',
        description: 'A tool to protect and replace context in text',
        theme_color: '#ffffff'
      }
    })] : [])
  ],
}))
