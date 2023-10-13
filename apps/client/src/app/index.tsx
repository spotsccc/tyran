import './global.css'
import { createHistoryRouter } from 'atomic-router'
import { createRoutesView, RouterProvider } from 'atomic-router-react'
import { fork, scopeBind } from 'effector'
import { Provider } from 'effector-react'
import { createBrowserHistory } from 'history'
import { useEffect } from 'react'
import { ArtifactPage } from '@/pages/artifact/ui'
import { MarketPage } from '@/pages/market'
import { MintArtifactPage } from '@/pages/mint'
import { MyArtifactsPage } from '@/pages/my-artifacts'
import { $$app } from '@/shared/app'
import {
  artifactRoute,
  controls,
  marketRoute,
  mintRoute,
  myArtifactRoute,
} from '@/shared/router'

const Routes = createRoutesView({
  routes: [
    { route: mintRoute, view: MintArtifactPage },
    { route: artifactRoute, view: ArtifactPage },
    { route: myArtifactRoute, view: MyArtifactsPage },
    { route: marketRoute, view: MarketPage },
  ],
  otherwise: () => <div>123123</div>,
})

const scope = fork()

export function App() {
  useEffect(() => {
    // eslint-disable-next-line effector/mandatory-scope-binding
    scopeBind($$app.inputs.started, { scope })()
  }, [])

  return (
    <Provider value={scope}>
      <RouterProvider router={router}>
        <Routes />
      </RouterProvider>
    </Provider>
  )
}

export const router = createHistoryRouter({
  routes: [
    { path: '/mint', route: mintRoute },
    { path: '/artifact/:id', route: artifactRoute },
    { path: '/', route: myArtifactRoute },
    { path: '/market', route: marketRoute },
  ],
  controls,
})

const history = createBrowserHistory()

router.setHistory(history)
