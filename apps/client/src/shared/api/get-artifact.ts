import { createQuery } from '@farfetched/core'
import { GetArtifactData, GetArtifactResponse } from 'api-contract'
import { createEffect } from 'effector'
import { baseRequest, Method } from './base-request'

const getArtifactFx = createEffect(({ id }: { id: string }) => {
  return baseRequest<GetArtifactResponse>({
    path: `/artifacts/${id}`,
    method: Method.GET,
  })
})

export const getArtifactQuery = createQuery({
  effect: getArtifactFx,
})
