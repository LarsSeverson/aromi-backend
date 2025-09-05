import { type WorkerKey } from '../types'
import { type ResultAsync } from 'neverthrow'
import { type ApiError } from '@src/utils/error'
import { type WorkerContext } from '../context'

export abstract class WorkerJob {
  key: WorkerKey
  protected readonly context: WorkerContext

  constructor (
    context: WorkerContext,
    key: WorkerKey
  ) {
    this.key = key
    this.context = context
  }

  abstract handle (): ResultAsync<this, ApiError>
}
