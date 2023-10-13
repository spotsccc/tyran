import { createMutation, createQuery } from '@farfetched/core'
import { createEffect } from 'effector'
import { baseRequest, Method } from '@/shared/api/base-request'
import { GetUserResponse, User } from 'api-contract'

export const accountConnectedMutation = createMutation({
  effect: createEffect(async ({ address }: { address: string }) => {
    await baseRequest({
      path: `/users/${address}`,
      method: Method.POST,
      body: {},
    })
  }),
})

export const getUserQuery = createQuery({
  effect: createEffect(
    async ({ address }: { address: string }): Promise<User> => {
      return await baseRequest<GetUserResponse>({
        path: `/users/${address}`,
        method: Method.GET,
      })
    },
  ),
})

export const uploadAvatarMutation = createMutation({
  effect: createEffect(
    async ({ file, address }: { file: File; address: string }) => {
      const formData = new FormData()
      formData.append('file', file)
      console.log('kek')
      return await fetch(`http://localhost:4000/api/users/${address}/avatar`, {
        method: Method.POST,
        body: formData,
        headers: {},
      })
    },
  ),
})
