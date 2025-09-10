import { requiredEnv } from '@src/utils/env-util.js'
import type { BackendError } from '@src/utils/error.js'
import { Result } from 'neverthrow'

export interface CdnWrapper {
  domain: string
  keyPairId: string
  privateKey: string
}

export const createCdnWrapper = (): Result<CdnWrapper, BackendError> => {
  return Result
    .combine(
      [
        requiredEnv('CDN_DOMAIN'),
        requiredEnv('CDN_KEY_PAIR_ID'),
        requiredEnv('CDN_PRIVATE_KEY')
      ]
    )
    .map(([
      domain,
      keyPairId,
      privateKey
    ]) => ({
      domain,
      keyPairId,
      privateKey
    }))
}
