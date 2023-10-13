import { Property, Rarity } from 'api-contract'
import { combine, createEvent, createStore, sample } from 'effector'
import { debug, or } from 'patronum'
import { accountConnect } from '@/features/account/connect'
import { Filter as QueryFilter, getArtifactsQuery } from '@/shared/api'
import { $$app, AppState } from '@/shared/app'
import { $$account, AccountState } from '@/shared/ethereum'
import { createFilter, Filter } from '@/shared/lib/filter'
import { createObserver } from '@/shared/lib/observer'
import { createPageReady } from '@/shared/lib/page-ready'
import { createPagination } from '@/shared/lib/pagination'
import { myArtifactRoute } from '@/shared/router'
import { syncQuery } from './sync-query'
import { uploadAvatarMutation } from '@/shared/api/users'

export const searchButtonClicked = createEvent()
export const fileLoaded = createEvent<File>()

export const $avatarFile = createStore<File | null>(null)
export const uploadButtonClicked = createEvent()

export const $loading = or(
  getArtifactsQuery.$pending,
  getArtifactsQuery.$status.map((status) => status === 'initial'),
)

export const $$accountConnect = accountConnect.factory.createModel({
  $shouldShow: $$app.outputs.$state.map(
    (state) =>
      state === AppState.accountCheckNotConnected ||
      state === AppState.providerFailed,
  ),
})

export const {
  $filter: $rarityFilter,
  filterCleared: rarityClearButtonClicked,
  conditionSelected: raritySelected,
} = createFilter<Rarity>()

export const {
  $filter: $propertyFilter,
  filterCleared: propertyClearButtonClicked,
  conditionSelected: propertySelected,
} = createFilter<Property>()

export const $appliedPropertyFilter = createStore<Array<Filter<Property>>>([])
export const $appliedRarityFilter = createStore<Array<Filter<Rarity>>>([])

export const $params = combine(
  {
    rarity: $appliedRarityFilter,
    property: $appliedPropertyFilter,
    owner: $$account.outputs.$selected.map((selected) => selected?.address),
  },
  ({ rarity, property, owner }): { filters: Array<QueryFilter> } => ({
    filters: [
      { owner },
      ...rarity.map((condition) => ({
        rarity: condition.id,
      })),
      ...property.map((condition) => ({
        property: condition.id,
      })),
    ],
  }),
)

export const {
  $data: $artifacts,
  load: loadArtifacts,
  initialLoad: initialLoadArtifacts,
} = createPagination({
  append(acc, next) {
    return {
      artifacts: {
        ids: [...acc.artifacts.ids, ...next.artifacts.ids],
        entities: { ...acc.artifacts.entities, ...next.artifacts.entities },
      },
      lots: {
        ids: [...acc.lots.ids, ...next.lots.ids],
        entities: { ...acc.lots.entities, ...next.lots.entities },
      },
    }
  },
  checkIsEnded(data) {
    return data.artifacts.ids.length < 10
  },
  initialState: {
    artifacts: { ids: [], entities: {} },
    lots: { ids: [], entities: {} },
  },
  query: getArtifactsQuery,
  count: 10,
  reset: [$appliedRarityFilter, $appliedPropertyFilter],
  $params,
})

export const $artifactsIds = $artifacts.map(({ artifacts }) => artifacts.ids)
export const $artifactsEntities = $artifacts.map(
  ({ artifacts }) => artifacts.entities,
)

export const { intersect, observerCreated } = createObserver()

sample({
  clock: intersect,
  filter([intersect]) {
    return intersect.isIntersecting
  },
  target: loadArtifacts,
})

syncQuery({ $filter: $rarityFilter, name: 'rarity' })

syncQuery({ $filter: $propertyFilter, name: 'property' })

const pageReady = createPageReady({
  filter: $$account.outputs.$state.map(
    (state) => state === AccountState.connected,
  ),
  route: myArtifactRoute,
  clock: $$account.outputs.connectionFinished,
})

sample({
  clock: fileLoaded,
  target: $avatarFile,
})

debug($avatarFile)

sample({
  clock: [searchButtonClicked, pageReady],
  source: $rarityFilter,
  target: $appliedRarityFilter,
})

sample({
  clock: [searchButtonClicked, pageReady],
  source: $propertyFilter,
  target: $appliedPropertyFilter,
})

sample({
  clock: [searchButtonClicked, pageReady],
  target: initialLoadArtifacts,
})

sample({
  clock: uploadButtonClicked,
  source: {
    address: $$account.outputs.$selected.map((selected) => selected?.address!),
    file: $avatarFile.map((file) => file!),
  },
  target: uploadAvatarMutation.start,
})
