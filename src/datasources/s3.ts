import { S3Client } from '@aws-sdk/client-s3'
import { requiredEnv } from '@src/common/env-util'
import { ApiError } from '@src/common/error'
import { err, ok, type Result } from 'neverthrow'

export interface S3DataSource {
  client: S3Client
  bucket: string
}

export const getS3 = (): Result<S3DataSource, ApiError> => {
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

export const AVATAR_KEY = (
  userId: number
): string => `users/${userId}/avatars/avatar.jpg`

export const PRESIGN_AVATAR_KEY = (
  userId: number,
  fileName: string
): string => `temp_uploads/${userId}/avatars/${fileName}`
