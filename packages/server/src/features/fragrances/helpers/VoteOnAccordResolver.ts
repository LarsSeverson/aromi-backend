import { type BackendError, unwrapOrThrow, type FragranceAccordVoteRow, INDEXATION_JOB_NAMES, AGGREGATION_JOB_NAMES } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'

type Mutation = MutationResolvers['voteOnFragranceAccord']

export class VoteOnAccordResolver extends MutationResolver<Mutation> {
  resolve () {
    return ResultAsync
      .fromPromise(
        this.handleVote(),
        error => error as BackendError
      )
  }

  private async handleVote () {
    const existingVote = await unwrapOrThrow(this.getExistingVote())
    const vote = await unwrapOrThrow(this.upsertVote(existingVote))
    const accord = await unwrapOrThrow(this.getAccord())

    await this.queueIndex(vote)
    await this.queueAggregate(vote)

    return accord
  }

  private queueIndex (vote: FragranceAccordVoteRow) {
    const { context } = this
    const { queues } = context

    const { fragranceId } = vote

    return queues
      .indexations
      .enqueue({
        jobName: INDEXATION_JOB_NAMES.INDEX_FRAGRANCE,
        data: { fragranceId }
      })
  }

  private queueAggregate (vote: FragranceAccordVoteRow) {
    const { context } = this
    const { queues } = context

    const { fragranceId, accordId } = vote

    return queues
      .aggregations
      .enqueue({
        jobName: AGGREGATION_JOB_NAMES.AGGREGATE_ACCORD_VOTES,
        data: { fragranceId, accordId }
      })
  }

  private getExistingVote () {
    const { me, args, context } = this

    const { input } = args
    const { services } = context

    const { fragranceId, accordId } = input
    const { fragrances } = services
    const userId = me.id

    return fragrances
      .accords
      .votes
      .findOne(
        eb => eb.and([
          eb('fragranceId', '=', fragranceId),
          eb('accordId', '=', accordId),
          eb('userId', '=', userId)
        ])
      )
      .orElse(error => {
        if (error.status === 404) return okAsync(null)
        return errAsync(error)
      })
  }

  private upsertVote (existingVote: FragranceAccordVoteRow | null) {
    const { me, args, context } = this

    const { input } = args
    const { services } = context

    const { fragranceId, accordId } = input
    const { fragrances } = services
    const userId = me.id

    const deletedAt = existingVote?.deletedAt == null
      ? new Date().toISOString()
      : null

    return fragrances
      .accords
      .votes
      .upsert(
        { fragranceId, userId, accordId },
        oc => oc
          .columns(['fragranceId', 'userId', 'accordId'])
          .doUpdateSet({ deletedAt })
      )
  }

  private getAccord () {
    const { args, context } = this

    const { input } = args
    const { services } = context

    const { accordId } = input
    const { accords } = services

    return accords
      .findOne(
        eb => eb('id', '=', accordId)
      )
  }
}