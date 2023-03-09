import nprogress from 'nprogress'
import { inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { globals } from '../../src/components/globals'
import '../../styles/vitepress.css'

const defineTheme = (T: typeof DefaultTheme) => T

export default defineTheme({
  ...DefaultTheme,

  enhanceApp({ app, router }) {
    Object.entries(globals).forEach(([name, component]) => {
      app.component(name, component)
    })

    if (inBrowser) {
      const { onBeforeRouteChange, onAfterRouteChanged } = router
      router.onBeforeRouteChange = to => {
        nprogress.start()
        onBeforeRouteChange?.(to)
      }
      router.onAfterRouteChanged = to => {
        nprogress.done()
        onAfterRouteChanged?.(to)
      }
    }
  },
})
