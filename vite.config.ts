import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteExternalsPlugin } from 'vite-plugin-externals'
// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    viteExternalsPlugin({
      vue: 'Vue',
      'vue-demi': 'VueDemi'
    })
  ]
})
