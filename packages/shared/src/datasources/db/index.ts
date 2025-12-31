import type { DB } from '@src/db/db-schema.js'
import { requiredEnv } from '@src/utils/env-util.js'
import { BackendError } from '@src/utils/error.js'
import { Kysely, PostgresDialect, CamelCasePlugin, HandleEmptyInListsPlugin, replaceWithNoncontingentExpression } from 'kysely'
import { ok, err } from 'neverthrow'
import type { Result } from 'neverthrow'
import { types, Pool } from 'pg'

types.setTypeParser(1114, str => str)
types.setTypeParser(1184, str => str)

const createPool = (): Result<Pool, BackendError> => {
  const dbHost = requiredEnv('DB_HOST')
  const dbUser = requiredEnv('DB_USER')
  const dbPassword = requiredEnv('DB_PASSWORD')
  const dbName = requiredEnv('DB_NAME')
  const dbPort = requiredEnv('DB_PORT')

  if (dbHost.isErr()) return err(new BackendError('MISSING_ENV', 'DB_HOST is missing', 500))
  if (dbUser.isErr()) return err(new BackendError('MISSING_ENV', 'DB_USER is missing', 500))
  if (dbPassword.isErr()) return err(new BackendError('MISSING_ENV', 'DB_PASSWORD is missing', 500))
  if (dbName.isErr()) return err(new BackendError('MISSING_ENV', 'DB_NAME is missing', 500))
  if (dbPort.isErr()) return err(new BackendError('MISSING_ENV', 'DB_PORT is missing', 500))

  const ssl = process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false

  const db = new Pool({
    host: dbHost.value,
    user: dbUser.value,
    password: dbPassword.value,
    database: dbName.value,
    port: Number(dbPort.value),
    ssl
  })

  return ok(db)
}

export const createDB = (): Result<Kysely<DB>, BackendError> => {
  return createPool()
    .map(pool => new Kysely<DB>(
      {
        dialect: new PostgresDialect({ pool }),
        plugins: [
          new CamelCasePlugin(),
          new HandleEmptyInListsPlugin({
            strategy: replaceWithNoncontingentExpression
          })
        ]
      }
    ))
}
