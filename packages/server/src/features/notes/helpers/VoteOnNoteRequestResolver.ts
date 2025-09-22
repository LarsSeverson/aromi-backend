import { parseOrThrow, unwrapOrThrow, AGGREGATION_JOB_NAMES, type NoteService } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { VoteOnRequestSchema } from '@src/features/requests/utils/validation.js'
import { mapNoteRequestRowToNoteRequestSummary } from '../utils/mappers.js'

type Mutation = MutationResolvers['voteOnNoteRequest']

export class VoteOnNoteRequestResolver extends MutationResolver<Mutation> {
  private trxService?: NoteService

  async resolve () {
    const { context } = this
    const { services } = context
    const { notes } = services

    const { request } = await unwrapOrThrow(
      notes
        .withTransactionAsync(async trx => {
          this.trxService = trx
          return await this.handleVote()
        })
    )

    await this.enqueueAggregation()

    return mapNoteRequestRowToNoteRequestSummary(request)
  }

  private async handleVote () {
    const { input } = this.args
    parseOrThrow(VoteOnRequestSchema, input)

    const request = await unwrapOrThrow(this.getRequest())
    const vote = await unwrapOrThrow(this.upsertVote())

    return { request, vote }
  }

  private enqueueAggregation () {
    const { requestId } = this.args.input
    const { queues } = this.context
    const { aggregations } = queues

    return aggregations
      .enqueue({
        jobName: AGGREGATION_JOB_NAMES.AGGREGATE_NOTE_REQUEST_VOTES,
        data: { requestId }
      })
  }

  private getRequest () {
    const { requestId } = this.args.input

    return this
      .trxService!
      .requests
      .findOne(eb => eb('id', '=', requestId))
  }

  private upsertVote () {
    const { me, args } = this

    const { requestId, vote } = args.input
    const userId = me.id

    return this
      .trxService!
      .requests
      .votes
      .upsert(
        { requestId, userId, vote },
        oc => oc
          .columns(['requestId', 'userId'])
          .doUpdateSet({ vote })
      )
  }
}