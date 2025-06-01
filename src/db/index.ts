import { type ApiError } from '@src/common/error'
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely'
import { ok, type Result } from 'neverthrow'
import { types, type Pool } from 'pg'
import { type DB } from './schema'

types.setTypeParser(1114, str => str)
types.setTypeParser(1184, str => str)

export const createDB = (pool: Pool): Result<Kysely<DB>, ApiError> => {
  const db = new Kysely<DB>({
    dialect: new PostgresDialect({ pool }),
    plugins: [
      new CamelCasePlugin()
    ]
  })

  return ok(db)
}
