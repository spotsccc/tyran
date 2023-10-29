import { modelFactory } from 'effector-factorio'
import { RouteInstance } from 'atomic-router'
import { createFilter } from '@/shared/lib/filter'
import { Gem, GetArtifactsData, Property, Rarity } from 'api-contract'
import { Filter as QueryFilter } from '@/shared/api'
import { $$account } from '@/shared/ethereum'
import {
  createInfiniteScroll,
  createPagination,
  withParams,
} from '@/shared/lib/pagination'
import { combine, createEvent, createStore, sample } from 'effector'
import { Query } from '@farfetched/core'
import { syncQuery } from '@/pages/my-artifacts/sync-query'

type Config = {
  route: RouteInstance<{ id: string }>
  query: Query<
    { filters: Array<QueryFilter>; offset: number; count: number },
    GetArtifactsData,
    Error,
    GetArtifactsData
  >
}

export const RarityOptions = [
  Rarity.common,
  Rarity.rare,
  Rarity.epic,
  Rarity.legendary,
  Rarity.mystery,
]

export const PropertyOptions = [
  Property.common,
  Property.magic,
  Property.cursed,
  Property.enchanted,
]

export const GemOptions = [Gem.red, Gem.blue, Gem.green, Gem.yellow]

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

  const {
    $filter: $gemFilter,
    filterCleared: gemClearButtonCleared,
    conditionSelected: gemSelected,
  } = createFilter<Gem>()

  syncQuery({ $filter: $rarityFilter, name: 'rarity' })

  syncQuery({ $filter: $propertyFilter, name: 'property' })

  syncQuery({ $filter: $gemFilter, name: 'gem' })

  const $params = combine(
    {
      rarity: $rarityFilter,
      property: $propertyFilter,
      gem: $gemFilter,
      owner: $$account.outputs.$selected.map((selected) => selected?.address),
    },
    ({ rarity, property, owner, gem }): { filters: Array<QueryFilter> } => ({
      filters: [
        { owner },
        ...rarity.map((condition) => ({
          rarity: condition.value,
        })),
        ...property.map((condition) => ({
          property: condition.value,
        })),
        ...gem.map((condition) => ({
          gem: condition.value,
        })),
      ],
    }),
  )

  const {
    $data: $artifacts,
    next,
    start,
  } = withParams({
    pagination: createPagination({
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
      isHasNext(data) {
        return data.artifacts.ids.length < 10
      },
      query,
      count: 10,
    }),
    $params,
  })

  const { observerCreated } = createInfiniteScroll({ next })
  const $artifactsIds = $artifacts.map(({ artifacts }) => artifacts.ids)
  const $artifactsEntities = $artifacts.map(
    ({ artifacts }) => artifacts.entities,
  )
  const $filtersOpened = createStore(false)

  const filtersButtonClicked = createEvent()
  const clearFiltersButtonsClicked = createEvent()
  const enterKeyPress = createEvent()
  const escKeyPress = createEvent()
  const apllyFilterClicked = createEvent()
  const outsideFiltersClicked = createEvent()

  sample({
    clock: filtersButtonClicked,
    fn: () => true,
    target: $filtersOpened,
  })

  sample({
    clock: clearFiltersButtonsClicked,
    target: [propertyClearButtonClicked, rarityClearButtonClicked],
  })

  sample({
    clock: [
      escKeyPress,
      enterKeyPress,
      apllyFilterClicked,
      outsideFiltersClicked,
    ],
    fn: () => false,
    target: $filtersOpened,
  })

  sample({
    clock: [enterKeyPress, apllyFilterClicked],
    target: start,
  })

  return {
    outsideFiltersClicked,
    gemSelected,
    $gemFilter,
    gemClearButtonCleared,
    apllyFilterClicked,
    enterKeyPress,
    escKeyPress,
    $filtersOpened,
    clearFiltersButtonsClicked,
    filtersButtonClicked,
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
    start,
  }
})
