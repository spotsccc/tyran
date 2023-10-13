import { Artifact } from 'api-contract'
import { Knex } from 'knex'
import { InjectConnection } from 'nest-knexjs'
import { IArtifactsRepository } from '@/application/repositories.interface'

export type Filter = {
  name?: string
  id?: string
  rarity?: string
  property?: string
  isOnSell?: boolean
  owner?: string
}

export enum Order {
  direct = 'direct',
  reverse = 'reverse',
}

export class ArtifactsRepository implements IArtifactsRepository {
  constructor(@InjectConnection() private readonly knex: Knex) { }

  public async getById({ id }: { id: string }): Promise<Artifact | null> {
    const [artifact] = await this.knex<Artifact>('artifacts')
      .select('*')
      .where({ id })
    if (!artifact) {
      return null
    }
    return artifact
  }

  public async getByIds({
    ids,
  }: {
    ids: Array<string>
  }): Promise<Array<Artifact>> {
    return this.knex<Artifact>('artifacts').select('*').whereIn('id', ids)
  }

  /**
   * @description Insert artifact to database.
   * @throws It can throw an error from database!
   */
  public async insert({
    name,
    id,
    gems,
    rarity,
    property,
    owner,
  }: Artifact): Promise<void> {
    await this.knex('artifacts').insert({
      name,
      id,
      gems: JSON.stringify(gems),
      rarity,
      property,
      owner,
    })
  }

  /**
   * @description Update database record with data from artifactUpdate by tokenId
   * @param tokenId
   * @param artifactUpdate
   * @throws
   */
  public async update({
    id,
    artifact,
  }: {
    id: string
    artifact: Partial<Artifact>
  }): Promise<void> {
    await this.knex('artifacts')
      .update({ ...artifact })
      .where({ id })
  }

  /**
   * @description Select artifacts from database by filters and conditions.
   * @throws It can throw an error from database!
   * @param filters use to filter records, union all filters with same property and intersect unioned filters.
   * @param count it is quantity of records that equal or less(if there are fewer records than count) than count.
   * @param offset if that the returned records will be displaced.
   * @param order if order equal to Order.direct, records will be returned in asc order of their id.
   * If order equal to Order.reverse, records will be returned in desc order of their id
   */
  public async getByFilters({
    filters,
    count,
    offset,
    order,
  }: {
    filters: Array<Filter>
    count: number
    offset: number
    order: Order
  }): Promise<Array<Artifact>> {
    const rarityFilter = filters.filter(({ rarity }) => Boolean(rarity))
    const propertyFilter = filters.filter(({ property }) => Boolean(property))
    const ownerFilter = filters.filter(({ owner }) => Boolean(owner))
    return this.knex<Artifact>('artifacts')
      .where((builder) => {
        propertyFilter.forEach((filter) => builder.orWhere(filter))
      })
      .andWhere((builder) => {
        ownerFilter.forEach((filter) => builder.orWhere(filter))
      })
      .andWhere((builder) => {
        rarityFilter.forEach((filter) => builder.orWhere(filter))
      })
      .offset(offset)
      .limit(count)
      .orderBy('id', order === Order.reverse ? 'desc' : 'asc')
  }
}
