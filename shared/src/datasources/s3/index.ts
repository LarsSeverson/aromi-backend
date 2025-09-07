import { S3Client } from '@aws-sdk/client-s3'
import { requiredEnv } from '@src/utils/env-util'
import { type ApiError } from '@src/utils/error'
import { Result } from 'neverthrow'

export * from './types'
export * from './utils'

export interface S3Wrapper {
  client: S3Client
  bucket: string
}

export const createS3Wrapper = (): Result<S3Wrapper, ApiError> => {
  return Result
    .combine([
      requiredEnv('AWS_REGION'),
      requiredEnv('AWS_ACCESS_KEY_ID'),
      requiredEnv('AWS_SECRET_ACCESS_KEY'),
      requiredEnv('S3_BUCKET')
    ])
    .map(([
      region,
      accessKeyId,
      secretAccessKey,
      bucket
    ]) => {
      const client = new S3Client({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey
        }
      })

      return { client, bucket }
    })
}
