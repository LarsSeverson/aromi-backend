import { type ApiError } from '@src/common/error'
import { createDB } from '@src/db'
import { type DB } from '@src/generated/db-schema'
import { type JwksClient } from 'jwks-rsa'
import { type Kysely } from 'kysely'
import { Result } from 'neverthrow'
import { createJwksClient } from './jwks'
import { type CognitoWrapper, createCognitoWrapper } from './cognito'
import { createS3Wrapper, type S3Wrapper } from './s3'
import { createCdnWrapper, type CdnWrapper } from './cdn'
import { createMeiliSearchWrapper, type MeiliSearchWrapper } from './meilisearch'

export interface DataSources {
  db: Kysely<DB>

  jwks: JwksClient
  cognito: CognitoWrapper
  s3: S3Wrapper
  cdn: CdnWrapper
  meili: MeiliSearchWrapper
}

export const getDataSources = (): Result<DataSources, ApiError> => {
  return Result
    .combine([
      createDB(),
      createJwksClient(),
      createCognitoWrapper(),
      createS3Wrapper(),
      createCdnWrapper(),
      createMeiliSearchWrapper()
    ])
    .map(([
      db,
      jwks,
      cognito,
      s3,
      cdn,
      meili
    ]) => ({
      db,
      jwks,
      cognito,
      s3,
      cdn,
      meili
    }))
}
