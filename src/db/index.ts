import { type ApiError } from '@src/common/error'
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely'
import { type Result } from 'neverthrow'
import { types } from 'pg'
import { type DB } from '../generated/db-schema'
import { createPool } from './pool'
export * from './types'

types.setTypeParser(1114, str => str)
types.setTypeParser(1184, str => str)

export const createDB = (): Result<Kysely<DB>, ApiError> => {
  return createPool()
    .map(pool => new Kysely<DB>(
      {
        dialect: new PostgresDialect({ pool }),
        plugins: [
          new CamelCasePlugin()
        ]
      }
    ))
}
