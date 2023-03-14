import nprogress from 'nprogress'
import { inBrowser, type Router } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { globals } from '~/components/index'
import '~/styles/vitepress.css'

const defineTheme = (T: typeof DefaultTheme) => T

function setupNprogress(router: Router) {
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

export default defineTheme({
  ...DefaultTheme,

  enhanceApp({ app, router }) {
    Object.entries(globals).forEach(([name, comp]) => app.component(name, comp))

    if (inBrowser) {
      setupNprogress(router)
    }
  },
})
