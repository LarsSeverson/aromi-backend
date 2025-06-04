import { S3Client } from '@aws-sdk/client-s3'
import { JwksClient } from 'jwks-rsa'
import { err, ok, type Result } from 'neverthrow'
import { ApiError } from '../common/error'
import { requiredEnv } from '../common/env-util'
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'
import { type Kysely } from 'kysely'
import { type DB } from '../db/schema'
import { createPool } from '../db/pool'
import { createDB } from '../db'

export interface CloudfrontSource {
  domain: string
  keyPairId: string
  privateKey: string
}

export interface S3DataSource {
  client: S3Client
  bucket: string
}

export interface CogDataSource {
  client: CognitoIdentityProviderClient
  clientId: string
  userPoolId: string
}

export interface ApiDataSources {
  db: Kysely<DB>
  s3: S3DataSource
  cog: CogDataSource
  jwksClient: JwksClient
  cloudfront: CloudfrontSource
}

const getCloudfront = (): Result<ApiDataSources['cloudfront'], ApiError> => {
  const domain = requiredEnv('CLOUDFRONT_DOMAIN')
  const keyPairId = requiredEnv('CLOUDFRONT_KEY_PAIR_ID')
  const privateKey = requiredEnv('CLOUDFRONT_PRIVATE_KEY')

  if (domain.isErr()) return err(new ApiError('MISSING_ENV', 'CLOUDFRONT_DOMAIN is missing', 500))
  if (keyPairId.isErr()) return err(new ApiError('MISSING_ENV', 'CLOUDFRONT_KEY_PAIR_ID is missing', 500))
  if (privateKey.isErr()) return err(new ApiError('MISSING_ENV', 'CLOUDFRONT_PRIVATE_KEY is missing', 500))

  return ok({
    domain: domain.value,
    keyPairId: keyPairId.value,
    privateKey: privateKey.value
  })
}

const getS3 = (): Result<ApiDataSources['s3'], ApiError> => {
  const awsRegion = requiredEnv('AWS_REGION')
  const awsAccessKeyId = requiredEnv('AWS_ACCESS_KEY_ID')
  const awsSecretAccessKey = requiredEnv('AWS_SECRET_ACCESS_KEY')
  const bucketRes = requiredEnv('S3_BUCKET')

  if (awsRegion.isErr()) return err(new ApiError('MISSING_ENV', 'AWS_REGION is missing', 500))
  if (awsAccessKeyId.isErr()) return err(new ApiError('MISSING_ENV', 'AWS_ACCESS_KEY_ID is missing', 500))
  if (awsSecretAccessKey.isErr()) return err(new ApiError('MISSING_ENV', 'AWS_SECRET_ACCESS_KEY is missing', 500))
  if (bucketRes.isErr()) return err(new ApiError('MISSING_ENV', 'S3 Bucket is missing', 500))

  const client = new S3Client({
    region: awsRegion.value,
    credentials: {
      accessKeyId: awsAccessKeyId.value,
      secretAccessKey: awsSecretAccessKey.value
    }
  })

  const bucket = bucketRes.value

  return ok({ client, bucket })
}

const getCog = (): Result<ApiDataSources['cog'], ApiError> => {
  const clientIdRes = requiredEnv('COGNITO_CLIENT_ID')
  const userPoolIdRes = requiredEnv('COGNITO_USER_POOL_ID')

  if (clientIdRes.isErr()) return err(new ApiError('MISSING_ENV', 'COGNITO_CLIENT_ID is missing', 500))
  if (userPoolIdRes.isErr()) return err(new ApiError('MISSING_ENV', 'COGNITO_USER_POOL_ID is missing', 500))

  const client = new CognitoIdentityProviderClient()
  const clientId = clientIdRes.value
  const userPoolId = userPoolIdRes.value

  return ok({ client, clientId, userPoolId })
}

const getJwksClient = (): Result<JwksClient, ApiError> => {
  const jwksUri = requiredEnv('JWKS_URI')

  if (jwksUri.isErr()) return err(new ApiError('MISSING_ENV', 'JWKS_URI is missing', 500))

  const jwksClient = new JwksClient({
    jwksUri: jwksUri.value,
    cache: true,
    cacheMaxEntries: 5,
    cacheMaxAge: 600_000
  })

  return ok(jwksClient)
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

  const db = dbRes.value
  const s3 = s3Res.value
  const cog = cogRes.value
  const jwksClient = jwksRes.value
  const cloudfront = cloudfrontRes.value

  return ok({
    db,
    s3,
    cog,
    jwksClient,
    cloudfront
  })
}
