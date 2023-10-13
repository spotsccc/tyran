import { Artifact, Lot, SaleRecord, User } from 'api-contract'
import { LotBlank } from '@/infrastructure/lots.repository'

export interface IUsersRepository {
  getByAddress: (_: { address: string }) => Promise<User | null>
  insert: (u: User) => Promise<void>
}

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY')

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

export interface IArtifactsRepository {
  getById(_: { id: string }): Promise<Artifact | null>
  getByIds(_: { ids: Array<string> }): Promise<Array<Artifact>>
  insert(artifact: Artifact): Promise<void>
  update(update: { id: string; artifact: Partial<Artifact> }): Promise<void>
  getByFilters(filters: {
    filters: Array<Filter>
    count: number
    offset: number
    order: Order
  }): Promise<Array<Artifact>>
}

export const ARTIFACTS_REPOSITORY = Symbol('ARTIFACTS_REPOSITORY')

export interface ILotsRepository {
  getByArtifactId(_: { artifactId: string }): Promise<Lot | null>
  getByArtifactIds(_: { artifactIds: Array<string> }): Promise<Array<Lot>>
  insert(lot: LotBlank): Promise<void>
  deleteByArtifactId(_: { artifactId: string }): Promise<void>
}

export const LOTS_REPOSITORY = Symbol('LOTS_REPOSITORY')

export type SaleRecordBlank = Omit<SaleRecord, 'id'>

export interface ISaleRecordsRepository {
  insert(_: SaleRecordBlank): Promise<void>
}

export const SALE_RECORDS_REPOSITORY = 'SALE_RECORDS_REPOSITORY'
