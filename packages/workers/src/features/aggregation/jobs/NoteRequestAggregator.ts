import { type AGGREGATION_JOB_NAMES, type AggregationJobPayload, type NoteRequestScoreRow, unwrapOrThrow } from '@aromi/shared'
import { BaseAggregator } from './BaseAggregator.js'
import type { Job } from 'bullmq'

type JobKey = typeof AGGREGATION_JOB_NAMES.AGGREGATE_NOTE_REQUEST_VOTES

export class NoteRequestAggregator extends BaseAggregator<AggregationJobPayload[JobKey], NoteRequestScoreRow> {
  async aggregate (job: Job<AggregationJobPayload[JobKey]>): Promise<NoteRequestScoreRow> {
    const { requestId } = job.data

    const scoreRow = await unwrapOrThrow(this.handleUpdateRow(requestId))

    return scoreRow
  }

  handleUpdateRow (
    requestId: string
  ) {
    const { services } = this.context
    const { notes } = services
    const { requests } = notes

    return requests
      .votes
      .scores
      .updateOne(
        eb => eb('requestId', '=', requestId),
        eb => ({
          upvotes: eb
            .selectFrom('noteRequestVotes')
            .select(eb =>
              eb
                .fn
                .coalesce(
                  eb.fn.sum<number>(
                    eb.case()
                      .when('noteRequestVotes.vote', '=', 1)
                      .then(1)
                      .else(0)
                      .end()
                  ),
                  eb.val(0)
                )
                .as('upvotes')
            )
            .where('noteRequestVotes.requestId', '=', requestId),
          downvotes: eb
            .selectFrom('noteRequestVotes')
            .select(eb =>
              eb
                .fn
                .coalesce(
                  eb.fn.sum<number>(
                    eb.case()
                      .when('noteRequestVotes.vote', '=', -1)
                      .then(1)
                      .else(0)
                      .end()
                  ),
                  eb.val(0)
                )
                .as('downvotes')
            )
            .where('noteRequestVotes.requestId', '=', requestId),
          updatedAt: new Date().toISOString()
        })
      )
  }
}