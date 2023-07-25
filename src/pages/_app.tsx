import { EffectorNext, getClientScope } from '@effector/next'
import { AppProps } from 'next/app'
import './global.css'
import { appStarted } from '../shared/events'
import { useEffect } from 'react'
import { scopeBind } from 'effector'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const clientScope = getClientScope()
    if (clientScope) {
      // eslint-disable-next-line effector/mandatory-scope-binding
      scopeBind(appStarted, { scope: clientScope })()
    }
  }, [])
  return (
    <main>
      <EffectorNext values={pageProps.values}>
        <Component />
      </EffectorNext>
    </main>
  )
}
