import { createQuery } from '@farfetched/core'
import { GetLotsResponse } from 'api-contract'
import { createEffect } from 'effector'
import { baseRequest, Method } from '@/shared/api/base-request'
import { Filter } from '.'

const getLotsFx = createEffect(
  ({
    filters,
    offset,
    count,
  }: {
    filters: Array<Filter>
    offset: number
    count: number
  }) => {
    return baseRequest<GetLotsResponse>({ path: '/lots', method: Method.GET })
  },
)

export const getLotsQuery = createQuery({
  effect: getLotsFx,
})
