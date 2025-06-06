import { err, ok, type Result } from 'neverthrow'
import { type ApiDataSources } from './datasources'
import { ApiError } from '@src/common/error'
import { requiredEnv } from '@src/common/env-util'

export interface CloudfrontSource {
  domain: string
  keyPairId: string
  privateKey: string
}
export const getCloudfront = (): Result<ApiDataSources['cloudfront'], ApiError> => {
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
