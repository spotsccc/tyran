import { createQuery } from '@farfetched/core'
import { GetLotsData } from 'api-contract'
import { createEffect } from 'effector'
import { baseRequest, Method } from '@/shared/api/base-request'

const getLotsFx = createEffect(() =>
  baseRequest<GetLotsData>({ path: '/lots', method: Method.GET }),
)

export const getLotsQuery = createQuery({
  effect: getLotsFx,
  initialData: {
    artifacts: {
      ids: [],
      entities: {},
    },
    lots: {
      ids: [],
      entities: {},
    },
  },
})
