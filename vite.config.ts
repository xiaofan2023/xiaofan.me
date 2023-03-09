import { resolve } from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { type UserConfig } from 'vite'

const mainPath = resolve(__dirname, 'src')
const typePath = resolve(mainPath, 'types')

export const userConfig: UserConfig = {
  resolve: {
    alias: [
      {
        find: '~/',
        replacement: `${mainPath}/`,
      },
    ],
  },
  plugins: [
    AutoImport({
      imports: ['vue'],
      dts: `${resolve(typePath, 'auto-imports.d.ts')}`,
    }),

    Components({
      dirs: [`${resolve(mainPath, 'components')}`],
      dts: `${resolve(typePath, 'components.d.ts')}`,
    }),
  ],
}
