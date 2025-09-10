import { ResultAsync } from 'neverthrow'
import { startServer } from './server.js'
import { BackendError } from '@aromi/shared'

const main = (): ResultAsync<string, BackendError> => {
  return ResultAsync
    .fromPromise(
      startServer(),
      error => new BackendError('INTERNAL_ERROR', 'Unable to start server', 500, error)
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
