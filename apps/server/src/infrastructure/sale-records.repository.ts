import { Knex } from 'knex'
import { InjectConnection } from 'nest-knexjs'
import {
  ISaleRecordsRepository,
  SaleRecordBlank,
} from '@/application/repositories.interface'

export class SaleRecordsRepository implements ISaleRecordsRepository {
  constructor(@InjectConnection() private readonly knex: Knex) { }

  public async insert({
    seller,
    artifactId,
    saleDate,
    lotCreationDate,
    price,
    buyer,
  }: SaleRecordBlank) {
    await this.knex('sale_records').insert({
      buyer,
      seller,
      artifact_id: artifactId,
      sale_date: saleDate,
      lot_creation_date: lotCreationDate,
      price,
    })
  }
}
