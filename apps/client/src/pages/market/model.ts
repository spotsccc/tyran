import { sample } from 'effector'
import { or } from 'patronum'
import { getLotsQuery } from '@/shared/api/get-lots'
import { artifactRoute, marketRoute } from '@/shared/router'
import { artifactFeed } from '@/widgets/artifact/feed'
import { createPageReady } from '@/shared/lib/page-ready'
import { $$account, AccountState } from '@/shared/ethereum'

export const $loading = or(
  getLotsQuery.$pending,
  getLotsQuery.$status.map((status) => status === 'initial'),
)

const pageReady = createPageReady({
  filter: $$account.outputs.$state.map(
    (state) => state === AccountState.connected,
  ),
  route: marketRoute,
  clock: $$account.outputs.connectionFinished,
})

export const $$artifactFeed = artifactFeed.factory.createModel({
  route: artifactRoute,
  query: getLotsQuery,
})

sample({
  clock: pageReady,
  target: $$artifactFeed.start,
})
