import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('artifacts', (table) => {
    table.string('name', 255).notNullable()
    table
      .string('owner', 255)
      .references('address')
      .inTable('users')
      .notNullable()
    table.string('id', 255).primary()
    table.string('rarity', 20).notNullable()
    table.string('property', 20).notNullable()
    table.jsonb('gems').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('artifacts')
}
