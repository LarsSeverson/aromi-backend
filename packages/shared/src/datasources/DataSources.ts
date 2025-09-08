import { type JwksClient } from 'jwks-rsa'
import { type Kysely } from 'kysely'
import { Result } from 'neverthrow'
import { CognitoWrapper, createCognitoWrapper } from './cognito/index.js'
import { createS3Wrapper, S3Wrapper } from './s3/index.js'
import { CdnWrapper, createCdnWrapper } from './cdn/index.js'
import { createMeiliSearchWrapper, MeiliSearchWrapper } from './meilisearch/index.js'
import { createRedisWrapper, RedisWrapper } from './redis/index.js'
import { ApiError } from '@src/utils/error.js'
import { createDB } from './db/index.js'
import { createJwksClient } from './jwks/index.js'
import { DB } from '@src/db/db-schema.js'

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
