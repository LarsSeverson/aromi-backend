import type { JwksClient } from 'jwks-rsa'
import { sql, type Kysely } from 'kysely'
import { type CognitoWrapper, createCognitoWrapper } from './cognito/index.js'
import { createS3Wrapper, type S3Wrapper } from './s3/index.js'
import { type CdnWrapper, createCdnWrapper } from './cdn/index.js'
import { createMeiliSearchWrapper, type MeiliSearchWrapper } from './meilisearch/index.js'
import { createRedisWrapper, type RedisWrapper } from './redis/index.js'
import { createDB } from './db/index.js'
import { createJwksClient } from './jwks/index.js'
import type { DB } from '@src/db/db-schema.js'
import { unwrapOrThrowSync } from '@src/utils/error.js'

export class DataSources {
  db: Kysely<DB>

  jwks: JwksClient
  cognito: CognitoWrapper
  s3: S3Wrapper
  cdn: CdnWrapper
  meili: MeiliSearchWrapper
  redis: RedisWrapper

  constructor () {
    const db = unwrapOrThrowSync(createDB())
    const jwks = unwrapOrThrowSync(createJwksClient())
    const cognito = unwrapOrThrowSync(createCognitoWrapper())
    const s3 = unwrapOrThrowSync(createS3Wrapper())
    const cdn = unwrapOrThrowSync(createCdnWrapper())
    const meili = unwrapOrThrowSync(createMeiliSearchWrapper())
    const redis = unwrapOrThrowSync(createRedisWrapper())

    this.db = db
    this.jwks = jwks
    this.cognito = cognito
    this.s3 = s3
    this.cdn = cdn
    this.meili = meili
    this.redis = redis
  }

  with (overrides: Partial<DataSources>): DataSources {
    return Object.assign(
      new DataSources(),
      this,
      overrides
    )
  }

  async healthCheck (): Promise<void> {
    await Promise.all([
      this.healthCheckDB(),
      this.healthCheckMeili(),
      this.healthCheckRedis()
    ])
  }

  async healthCheckDB () {
    return await sql`SELECT 1`.execute(this.db)
  }

  async healthCheckRedis () {
    await this.redis.client.ping()
  }

  async healthCheckMeili () {
    await this.meili.client.health()
  }
}