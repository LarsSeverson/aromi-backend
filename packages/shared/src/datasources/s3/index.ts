import { S3Client } from '@aws-sdk/client-s3'
import { requiredEnv } from '@src/utils/env-util.js'
import type { BackendError } from '@src/utils/error.js'
import { Result } from 'neverthrow'

export * from './types.js'
export * from './utils.js'

export interface S3Wrapper {
  client: S3Client
  bucket: string
}

export const createS3Wrapper = (): Result<S3Wrapper, BackendError> => {
  return Result
    .combine([
      requiredEnv('AWS_REGION'),
      requiredEnv('S3_BUCKET')
    ])
    .map(([
      region,
      bucket
    ]) => {
      const accessKeyId = process.env.AWS_ACCESS_KEY_ID
      const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

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
