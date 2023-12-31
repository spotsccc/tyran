import { cache, createQuery } from '@farfetched/core'
import { Gem, GetArtifactsResponse, Property, Rarity } from 'api-contract'
import { createEffect, sample } from 'effector'
import { baseRequest, Method } from '@/shared/api/base-request'
import { $$shop } from '@/shared/ethereum'

export type Filter = {
  owner?: string
  rarity?: Rarity
  property?: Property
  gem?: Gem
}

const getArtifactsFx = createEffect(
  async ({
    filters,
    count,
    offset,
  }: {
    filters: Array<Filter>
    count: number
    offset: number
  }) => {
    console.log(filters)
    const queryParams = createQueryParams(filters)
    return baseRequest<GetArtifactsResponse>({
      path: `/artifacts?${queryParams}&offset=${offset}&count=${count}`,
      method: Method.GET,
    })
  },
)

export const getArtifactsQuery = createQuery({
  effect: getArtifactsFx,
  mapData: (v) => v.result,
  initialData: {
    lots: {
      ids: [],
      entities: {},
    },
    artifacts: {
      ids: [],
      entities: {},
    },
  },
})

const reset = sample({
  clock: [
    $$shop.inputs.buyArtifactFx.done,
    $$shop.inputs.placeArtifactFx.done,
    $$shop.inputs.buyArtifactFromMarketFx.done,
  ],
  fn: () => {},
})

cache(getArtifactsQuery, { staleAfter: '10m', purge: reset })

function createQueryParams(filters?: Array<Filter>) {
  if (!filters) {
    return ''
  }
  const filterNames: Array<keyof Filter> = [
    'owner',
    'rarity',
    'property',
    'gem',
  ]
  return filterNames
    .map((name) => createQueryParam(filters, name))
    .filter((str) => str.length > 0)
    .join('&')
}

function createQueryParam(filters: Array<Filter>, name: keyof Filter) {
  const currentFilter = filters.map((filter) => filter[name]).filter(Boolean)
  if (currentFilter.length === 0) {
    return ''
  }
  return currentFilter.map((filter) => `${name}=${filter}`).join('&')
}
