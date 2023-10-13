import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('sale_records', (table) => {
    table.increments('id').primary()
    table.string('artifact_id').references('id').inTable('artifacts')
    table.string('price').notNullable()
    table.timestamp('lot_creation_date').notNullable()
    table.timestamp('sale_date').notNullable()
    table.string('seller').references('address').inTable('users')
    table.string('buyer').references('address').inTable('users')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('sale_records')
}
