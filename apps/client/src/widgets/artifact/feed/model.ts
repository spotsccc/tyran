import { modelFactory } from 'effector-factorio'
import { RouteInstance } from 'atomic-router'
import { Filter, createFilter } from '@/shared/lib/filter'
import { GetArtifactsData, Property, Rarity } from 'api-contract'
import { Filter as QueryFilter } from '@/shared/api'
import { $$account } from '@/shared/ethereum'
import { createPagination } from '@/shared/lib/pagination'
import { combine, createStore, sample } from 'effector'
import { Query } from '@farfetched/core'
import { createObserver } from '@/shared/lib/observer'
import { syncQuery } from '@/pages/my-artifacts/sync-query'

type Config = {
  route: RouteInstance<{ id: string }>
  query: Query<
    { filters: Array<QueryFilter>; offset: number; count: number },
    GetArtifactsData,
    Error
  >
}

export const factory = modelFactory(({ route, query }: Config) => {
  const {
    $filter: $rarityFilter,
    filterCleared: rarityClearButtonClicked,
    conditionSelected: raritySelected,
  } = createFilter<Rarity>()

  const {
    $filter: $propertyFilter,
    filterCleared: propertyClearButtonClicked,
    conditionSelected: propertySelected,
  } = createFilter<Property>()

  const $appliedPropertyFilter = createStore<Array<Filter<Property>>>([])
  const $appliedRarityFilter = createStore<Array<Filter<Rarity>>>([])

  const $params = combine(
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

  const {
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
    query,
    count: 10,
    reset: [$appliedRarityFilter, $appliedPropertyFilter],
    $params,
  })

  const $artifactsIds = $artifacts.map(({ artifacts }) => artifacts.ids)
  const $artifactsEntities = $artifacts.map(
    ({ artifacts }) => artifacts.entities,
  )

  const { intersect, observerCreated } = createObserver()

  sample({
    clock: intersect,
    filter([intersect]) {
      return intersect.isIntersecting
    },
    target: loadArtifacts,
  })

  syncQuery({ $filter: $rarityFilter, name: 'rarity' })

  syncQuery({ $filter: $propertyFilter, name: 'property' })

  return {
    route,
    raritySelected,
    $rarityFilter,
    rarityClearButtonClicked,
    $propertyFilter,
    propertySelected,
    propertyClearButtonClicked,
    $artifactsIds,
    $artifactsEntities,
    observerCreated,
    initialLoadArtifacts,
    $appliedRarityFilter,
    $appliedPropertyFilter,
  }
})
