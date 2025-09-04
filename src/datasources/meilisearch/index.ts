import { requiredEnv } from '@src/common/env-util'
import { type ApiError } from '@src/common/error'
import { MeiliSearch } from 'meilisearch'
import { Result } from 'neverthrow'

export interface MeiliSearchWrapper {
  client: MeiliSearch
}

export const createMeiliSearchWrapper = (): Result<MeiliSearchWrapper, ApiError> => {
  return Result
    .combine([
      requiredEnv('MEILI_HOST'),
      requiredEnv('MEILI_MASTER_KEY')
    ])
    .map(([host, apiKey]) => {
      const client = new MeiliSearch({
        host,
        apiKey
      })
      return { client }
    })
}
