import { type ApiError } from '@src/common/error'
import { Kysely, PostgresDialect } from 'kysely'
import { ok, type Result } from 'neverthrow'
import { type Pool } from 'pg'
import { type DB } from './schema'

export const createDB = (pool: Pool): Result<Kysely<DB>, ApiError> => {
  const db = new Kysely<DB>({
    dialect: new PostgresDialect({ pool })
  })

  return ok(db)
}
