import { type ApiError } from '@src/common/error'
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely'
import { ok, type Result } from 'neverthrow'
import { type Pool } from 'pg'
import { type DB } from './schema'

export const createDB = (pool: Pool): Result<Kysely<DB>, ApiError> => {
  const db = new Kysely<DB>({
    dialect: new PostgresDialect({ pool }),
    plugins: [new CamelCasePlugin()]
  })

  return ok(db)
}
