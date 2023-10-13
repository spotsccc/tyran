import { Injectable } from '@nestjs/common'
import { User } from 'api-contract'
import { Knex } from 'knex'
import { InjectConnection } from 'nest-knexjs'
import { IUsersRepository } from '@/application/repositories.interface'

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(@InjectConnection() private readonly knex: Knex) { }

  public async getByAddress({
    address,
  }: {
    address: string
  }): Promise<User | null> {
    const [user] = await this.knex('users').select('*').where({ address })
    if (!user) {
      return null
    }
    return user
  }

  public async insert(user: User) {
    await this.knex('users').insert(user)
  }
}
