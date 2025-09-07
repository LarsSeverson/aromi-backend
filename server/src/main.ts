import { ApiError } from '@aromi/shared/utils/error'
import { ResultAsync } from 'neverthrow'
import { startServer } from './server'

const main = (): ResultAsync<string, ApiError> => {
  return ResultAsync
    .fromPromise(
      startServer(),
      error => new ApiError('INTERNAL_ERROR', 'Unable to start server', 500, error)
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
