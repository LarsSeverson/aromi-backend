import { ResultAsync } from 'neverthrow'
import { startSever } from './server'
import { ApiError } from './common/error'

const main = (): ResultAsync<string, ApiError> => {
  return ResultAsync
    .fromPromise(
      startSever(),
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
