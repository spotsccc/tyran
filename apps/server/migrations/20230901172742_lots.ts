import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('lots', (table) => {
    table.increments('id').primary()
    table.string('artifact_id').references('id').inTable('artifacts')
    table.string('price').notNullable()
    table.timestamp('creation_date').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('lots')
}
