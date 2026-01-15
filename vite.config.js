import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import { viteExternalsPlugin } from 'vite-plugin-externals'

export default ({ mode }) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return defineConfig({
    plugins: [
      vue(),
      // Map Vue imports to the global `__VUE_SHARED__` object on the `window`.
      viteExternalsPlugin({ vue: '__VUE_SHARED__', pinia: '__PINIA_SHARED__' }),
      // The "Icons" plugin generates icon components from Iconify collections.
      Icons({ scale: 1, compiler: 'vue3' })
    ],
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode)
    },
    build: {
      sourcemap: mode === 'development',
      lib: {
        entry: path.resolve(__dirname, 'main.js'),
        name: 'index',
        fileName: 'index'
      }
    },
    resolve: {
      dedupe: ['vue'],
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue'],
      alias: {
        '@': path.resolve(__dirname)
      }
    }
  })
}
