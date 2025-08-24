import { type ApiError } from '@src/common/error'
import { createDB } from '@src/db'
import { type DB } from '@src/db/schema'
import { type JwksClient } from 'jwks-rsa'
import { type Kysely } from 'kysely'
import { Result } from 'neverthrow'
import { createJwksClient } from './jwks'
import { type CognitoWrapper, createCognitoWrapper } from './cognito'
import { createS3Wrapper, type S3Wrapper } from './s3'

export interface DataSources {
  db: Kysely<DB>

  jwks: JwksClient
  cognito: CognitoWrapper
  s3: S3Wrapper
}

export const getDataSources = (): Result<DataSources, ApiError> => {
  return Result
    .combine([
      createDB(),
      createJwksClient(),
      createCognitoWrapper(),
      createS3Wrapper()
    ])
    .map(([
      db,
      jwks,
      cognito,
      s3
    ]) => ({
      db,
      jwks,
      cognito,
      s3
    }))
}
