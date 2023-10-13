import { Response } from './response'

export type User = {
  address: string
  username: string
  avatar?: string
}

export type GetUserResponse = Response<User>
