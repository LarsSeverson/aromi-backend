import { ResultAsync } from 'neverthrow'
import { startServer } from './server'
import { utils } from '@aromi/shared'

const main = (): ResultAsync<string, utils.ApiError> => {
  return ResultAsync
    .fromPromise(
      startServer(),
      error => new utils.ApiError('INTERNAL_ERROR', 'Unable to start server', 500, error)
    )
}

void main()
  .match(
    (url) => {
      console.log(`🚀 Server ready at ${url}`)
    },
    (error) => {
      console.error(error)
    }
  )
