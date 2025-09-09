import { S3Client } from '@aws-sdk/client-s3'
import { requiredEnv } from '@src/utils/env-util.js'
import type { ApiError } from '@src/utils/error.js'
import { Result } from 'neverthrow'

export * from './types.js'
export * from './utils.js'

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
