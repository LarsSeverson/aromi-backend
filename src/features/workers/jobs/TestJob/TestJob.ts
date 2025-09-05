import { type ApiError } from '@src/utils/error'
import { okAsync, type ResultAsync } from 'neverthrow'
import { WorkerJob } from '../WorkerJob'
import { type WorkerContext } from '../../context'

export class TestJob extends WorkerJob {
  constructor (context: WorkerContext) {
    super(context, 'test_job')
  }

  handle (): ResultAsync<this, ApiError> {
    console.log('Test job executed')
    return okAsync(this)
  }
}
