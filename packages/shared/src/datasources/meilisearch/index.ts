import { requiredEnv } from '@src/utils/env-util.js'
import type { BackendError } from '@src/utils/error.js'
import { MeiliSearch } from 'meilisearch'
import { Result } from 'neverthrow'

export interface MeiliSearchWrapper {
  client: MeiliSearch
}

export const createMeiliSearchWrapper = (): Result<MeiliSearchWrapper, BackendError> => {
  return Result
    .combine([
      requiredEnv('MEILI_HOST'),
      requiredEnv('MEILI_MASTER_KEY')
    ])
    .map(([host, apiKey]) => {
      const client = new MeiliSearch({ host, apiKey })
      return { client }
    })
}
