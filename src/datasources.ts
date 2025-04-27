import { S3Client } from '@aws-sdk/client-s3'
import { JwksClient } from 'jwks-rsa'
import { err, ok, type Result } from 'neverthrow'
import { Pool } from 'pg'
import { ApiError } from './common/error'
import { requiredEnv } from './common/env-util'
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'

export interface S3DataSource {
  client: S3Client
  bucket: string
}

export interface CogDataSource {
  client: CognitoIdentityProviderClient
  clientId: string
}

export interface ApiDataSources {
  db: Pool
  s3: S3DataSource
  cog: CogDataSource
  jwksClient: JwksClient
}

const getPool = (): Result<Pool, ApiError> => {
  const dbHost = requiredEnv('DB_HOST')
  const dbUser = requiredEnv('DB_USER')
  const dbPassword = requiredEnv('DB_PASSWORD')
  const dbName = requiredEnv('DB_NAME')
  const dbPort = requiredEnv('DB_PORT')

  if (dbHost.isErr()) return err(new ApiError('MISSING_ENV', 'DB_HOST is missing', 500))
  if (dbUser.isErr()) return err(new ApiError('MISSING_ENV', 'DB_USER is missing', 500))
  if (dbPassword.isErr()) return err(new ApiError('MISSING_ENV', 'DB_PASSWORD is missing', 500))
  if (dbName.isErr()) return err(new ApiError('MISSING_ENV', 'DB_NAME is missing', 500))
  if (dbPort.isErr()) return err(new ApiError('MISSING_ENV', 'DB_PORT is missing', 500))

  const db = new Pool({
    host: dbHost.value,
    user: dbUser.value,
    password: dbPassword.value,
    database: dbName.value,
    port: Number(dbPort.value)
  })

  return ok(db)
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
  if (clientIdRes.isErr()) return err(new ApiError('MISSING_ENV', 'COGNITO_CLIENT_ID is missing', 500))

  const client = new CognitoIdentityProviderClient()
  const clientId = clientIdRes.value

  return ok({ client, clientId })
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
  const poolRes = getPool()
  if (poolRes.isErr()) return err(poolRes.error)

  const s3Res = getS3()
  if (s3Res.isErr()) return err(s3Res.error)

  const cogRes = getCog()
  if (cogRes.isErr()) return err(cogRes.error)

  const jwksRes = getJwksClient()
  if (jwksRes.isErr()) return err(jwksRes.error)

  const db = poolRes.value
  const s3 = s3Res.value
  const cog = cogRes.value
  const jwksClient = jwksRes.value

  return ok({
    db,
    s3,
    cog,
    jwksClient
  })
}
