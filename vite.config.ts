import { defineConfig, UserConfigExport } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import { resolve } from 'path'
// import monacoEditorPlugin from 'vite-plugin-monaco-editor'
import typescript from '@rollup/plugin-typescript'

export default defineConfig((ctx) => {
  const config: UserConfigExport = {
    plugins: [reactRefresh()],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/components/index.tsx'),
        name: 'editor',
        formats: ['es', 'umd'],
        fileName: (format) => `editor.${format}.js`,
      },
      rollupOptions: {
        external: ['react', 'antd', 'antd/dist/antd.css', 'react-monaco-editor'],
        output: {
          globals: {
            react: 'React',
            antd: 'antd',
            'react-monaco-editor': 'MonacoEditor',
          },
          exports: 'named',
        },
      },
    },
  }
  if (ctx.mode === 'production') {
    config.plugins.push(
      typescript({
        include: ['src/components/**/*.ts', 'src/components/**/*.tsx'],
      })
    )
  }
  return config
})
