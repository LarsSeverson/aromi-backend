import { requiredEnv } from '@src/common/env-util'
import { type ApiError } from '@src/common/error'
import { MeiliSearch } from 'meilisearch'
import { err, ok, Result } from 'neverthrow'

export interface SearchDatasource {
  client: MeiliSearch
}

export const getSearch = (): Result<SearchDatasource, ApiError> => {
  const hostRes = requiredEnv('MEILISEARCH_URL')
  const apiKeyRes = requiredEnv('MEILISEARCH_API_KEY')

  return Result
    .combine([hostRes, apiKeyRes])
    .match(
      ([host, apiKey]) => {
        const client = new MeiliSearch({ host, apiKey })
        return ok({ client })
      },
      error => err(error)
    )
}
