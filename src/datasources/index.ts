import { type ApiError } from '@src/utils/error'
import { createDB } from './db'
import { type DB } from '@generated/db-schema'
import { type JwksClient } from 'jwks-rsa'
import { type Kysely } from 'kysely'
import { Result } from 'neverthrow'
import { createJwksClient } from './jwks'
import { type CognitoWrapper, createCognitoWrapper } from './cognito'
import { createS3Wrapper, type S3Wrapper } from './s3'
import { createCdnWrapper, type CdnWrapper } from './cdn'
import { createMeiliSearchWrapper, type MeiliSearchWrapper } from './meilisearch'
import { createRedisWrapper, type RedisWrapper } from './redis'

export interface DataSources {
  db: Kysely<DB>

  jwks: JwksClient
  cognito: CognitoWrapper
  s3: S3Wrapper
  cdn: CdnWrapper
  meili: MeiliSearchWrapper
  redis: RedisWrapper
}

export const createDataSources = (): Result<DataSources, ApiError> => {
  return Result
    .combine([
      createDB(),
      createJwksClient(),
      createCognitoWrapper(),
      createS3Wrapper(),
      createCdnWrapper(),
      createMeiliSearchWrapper(),
      createRedisWrapper()
    ])
    .map(([
      db,
      jwks,
      cognito,
      s3,
      cdn,
      meili,
      redis
    ]) => ({
      db,
      jwks,
      cognito,
      s3,
      cdn,
      meili,
      redis
    }))
}
