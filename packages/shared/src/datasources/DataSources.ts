import type { JwksClient } from 'jwks-rsa'
import type { Kysely } from 'kysely'
import { type CognitoWrapper, createCognitoWrapper } from './cognito/index.js'
import { createS3Wrapper, type S3Wrapper } from './s3/index.js'
import { type CdnWrapper, createCdnWrapper } from './cdn/index.js'
import { createMeiliSearchWrapper, type MeiliSearchWrapper } from './meilisearch/index.js'
import { createRedisWrapper, type RedisWrapper } from './redis/index.js'
import { createDB } from './db/index.js'
import { createJwksClient } from './jwks/index.js'
import type { DB } from '@src/db/db-schema.js'

export class DataSources {
  db: Kysely<DB>

  jwks: JwksClient
  cognito: CognitoWrapper
  s3: S3Wrapper
  cdn: CdnWrapper
  meili: MeiliSearchWrapper
  redis: RedisWrapper

  constructor () {
    const db = createDB()
    if (db.isErr()) throw db.error

    const jwks = createJwksClient()
    if (jwks.isErr()) throw jwks.error

    const cognito = createCognitoWrapper()
    if (cognito.isErr()) throw cognito.error

    const s3 = createS3Wrapper()
    if (s3.isErr()) throw s3.error

    const cdn = createCdnWrapper()
    if (cdn.isErr()) throw cdn.error

    const meili = createMeiliSearchWrapper()
    if (meili.isErr()) throw meili.error

    const redis = createRedisWrapper()
    if (redis.isErr()) throw redis.error

    this.db = db.value
    this.jwks = jwks.value
    this.cognito = cognito.value
    this.s3 = s3.value
    this.cdn = cdn.value
    this.meili = meili.value
    this.redis = redis.value
  }

  with (overrides: Partial<DataSources>): DataSources {
    return Object.assign(
      new DataSources(),
      this,
      overrides
    )
  }
}