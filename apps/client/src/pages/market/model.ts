import { sample } from 'effector'
import { or } from 'patronum'
import { getLotsQuery } from '@/shared/api/get-lots'
import { marketRoute } from '@/shared/router'

export const $loading = or(
  getLotsQuery.$pending,
  getLotsQuery.$status.map((status) => status === 'initial'),
)

export const $lotsIds = getLotsQuery.$data.map((data) => data.lots.ids)
export const $lots = getLotsQuery.$data.map((data) => data.lots.entities)
export const $artifactsIds = getLotsQuery.$data.map(
  (data) => data.artifacts.ids,
)
export const $artifacts = getLotsQuery.$data.map(
  (data) => data.artifacts.entities,
)

sample({
  clock: marketRoute.opened,
  target: getLotsQuery.start,
})
