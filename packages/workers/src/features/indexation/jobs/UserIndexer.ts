import { unwrapOrThrow, type INDEXATION_JOB_NAMES, type IndexationJobPayload } from '@aromi/shared'
import { BaseIndexer } from './BaseIndexer.js'
import type { UserDoc } from '@aromi/shared/src/search/features/users/types.js'
import type { Job } from 'bullmq'

type JobKey = typeof INDEXATION_JOB_NAMES.INDEX_USER

export class UserIndexer extends BaseIndexer<IndexationJobPayload[JobKey], UserDoc> {
  async index (job: Job<IndexationJobPayload[JobKey]>): Promise<UserDoc> {
    const { services } = this.context
    const { users } = services.search

    const { userId } = job.data

    const user = await unwrapOrThrow(this.getUserRow(userId))
    const doc = users.fromRow({ user })

    await users.addDocument(doc)

    return doc
  }

  private getUserRow (userId: string) {
    const { services } = this.context
    const { users } = services

    return users.findOne(eb => eb('id', '=', userId))
  }
}