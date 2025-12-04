import { requiredEnv } from '@src/utils/env-util.js'
import type { BackendError } from '@src/utils/error.js'
import { Result } from 'neverthrow'

export interface CdnWrapper {
  domain: string
}

export const createCdnWrapper = (): Result<CdnWrapper, BackendError> => {
  return Result
    .combine(
      [
        requiredEnv('CDN_DOMAIN')
      ]
    )
    .map(([
      domain
    ]) => ({
      domain
    }))
}
