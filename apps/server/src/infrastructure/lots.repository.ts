import { Lot } from 'api-contract'
import { Injectable } from '@nestjs/common'
import { InjectConnection } from 'nest-knexjs'
import { Knex } from 'knex'
import { ILotsRepository } from '@/application/repositories.interface'

export type LotBlank = Omit<Lot, 'id'>

export type Filter = {
  priceFrom?: string
  priceTo?: string
  seller?: string
  rarity?: string
  property?: string
}

@Injectable()
export class LotsRepository implements ILotsRepository {
  constructor(@InjectConnection() private readonly knex: Knex) { }

  public async insert({ creationDate, artifactId, price }: LotBlank) {
    await this.knex('lots').insert({
      artifact_id: artifactId,
      price,
      creation_date: creationDate,
    })
  }

  public async deleteByArtifactId({ artifactId }: { artifactId: string }) {
    await this.knex('lots').delete().where({ token_id: artifactId })
  }

  public async getByFilter(): Promise<Array<Lot>> {
    return this.knex('lots')
      .select('*', 'artifact_id as artifactId', 'creation_date as creationDate')
      .limit(10)
  }

  public async getByArtifactIds({
    artifactIds,
  }: {
    artifactIds: Array<string>
  }): Promise<Array<Lot>> {
    return this.knex('lots')
      .select('*', 'artifact_id as artifactId', 'creation_date as creationDate')
      .whereIn('artifact_id', artifactIds)
  }

  public async getByArtifactId({
    artifactId,
  }: {
    artifactId: string
  }): Promise<Lot | null> {
    const [lot] = await this.knex('lots')
      .select('*', 'artifact_id as artifactId', 'creation_date as creationDate')
      .where({ artifact_id: artifactId })
    if (!lot) {
      return null
    }
    return lot
  }
}
