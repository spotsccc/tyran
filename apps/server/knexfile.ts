import { config } from 'dotenv'
import type { Knex } from 'knex'
import * as process from 'process'

config()

const knexConfig: Knex.Config = {
  client: 'postgresql',
  connection: {
    database: process.env.DATABASE,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.HOST,
    port: Number(process.env.DATABASE_PORT),
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
}

module.exports = knexConfig
