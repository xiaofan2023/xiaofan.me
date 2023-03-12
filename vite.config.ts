import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { type UserConfig } from 'vite'

export const _dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : dirname(fileURLToPath(import.meta.url))

const mainPath = resolve(_dirname, 'src')
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
      resolvers: [IconsResolver()],
    }),

    // https://github.com/antfu/unplugin-icons
    Icons({
      compiler: 'vue3',
    }),
  ],
}
