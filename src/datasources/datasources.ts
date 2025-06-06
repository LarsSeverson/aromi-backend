import { err, ok, type Result } from 'neverthrow'
import { type Kysely } from 'kysely'
import { type DB } from '../db/schema'
import { createPool } from '../db/pool'
import { createDB } from '../db'
import { type JwksClient } from 'jwks-rsa'
import { getS3, type S3DataSource } from './s3'
import { getCog, type CogDataSource } from './cog'
import { getCloudfront, type CloudfrontSource } from './cloudfront'
import { type ApiError } from '@src/common/error'
import { getJwksClient } from './jwks'
import { getSearch, type SearchDatasource } from './search'

export interface ApiDataSources {
  db: Kysely<DB>
  s3: S3DataSource
  cog: CogDataSource
  jwksClient: JwksClient
  cloudfront: CloudfrontSource
  search: SearchDatasource
}

export const getDataSources = (): Result<ApiDataSources, ApiError> => {
  const poolRes = createPool()
  if (poolRes.isErr()) return err(poolRes.error)

  const dbRes = createDB(poolRes.value)
  if (dbRes.isErr()) return err(dbRes.error)

  const s3Res = getS3()
  if (s3Res.isErr()) return err(s3Res.error)

  const cogRes = getCog()
  if (cogRes.isErr()) return err(cogRes.error)

  const jwksRes = getJwksClient()
  if (jwksRes.isErr()) return err(jwksRes.error)

  const cloudfrontRes = getCloudfront()
  if (cloudfrontRes.isErr()) return err(cloudfrontRes.error)

  const searchRes = getSearch()
  if (searchRes.isErr()) return err(searchRes.error)

  const db = dbRes.value
  const s3 = s3Res.value
  const cog = cogRes.value
  const jwksClient = jwksRes.value
  const cloudfront = cloudfrontRes.value
  const search = searchRes.value

  return ok({
    db,
    s3,
    cog,
    jwksClient,
    cloudfront,
    search
  })
}
