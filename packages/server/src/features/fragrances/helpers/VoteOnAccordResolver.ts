import { unwrapOrThrow, AGGREGATION_JOB_NAMES, parseOrThrow, BackendError } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { GenericVoteOnEntityInputSchema } from '@src/utils/validation.js'
import { MAX_ACCORD_VOTES } from '../utils/constants.js'
import { errAsync, okAsync } from 'neverthrow'
import { VOTE_TYPES } from '@src/utils/constants.js'

type Mutation = MutationResolvers['voteOnFragranceAccord']

export class VoteOnAccordResolver extends MutationResolver<Mutation> {
  async resolve () {
    const { input } = this.args
    parseOrThrow(GenericVoteOnEntityInputSchema, input)

    const accord = await unwrapOrThrow(this.getAccord())

    await unwrapOrThrow(this.checkCanVote())
    await unwrapOrThrow(this.upsertVote())

    await this.enqueueAggregation()

    return accord
  }

  private enqueueAggregation () {
    const { context, args } = this
    const { queues } = context

    const { fragranceId, accordId } = args.input

    return queues
      .aggregations
      .enqueue({
        jobName: AGGREGATION_JOB_NAMES.AGGREGATE_ACCORD_VOTES,
        data: { fragranceId, accordId }
      })
  }

  private upsertVote () {
    const { me, args, context } = this

    const { input } = args
    const { services } = context

    const { fragranceId, accordId, vote } = input
    const userId = me.id

    const { fragrances } = services

    return fragrances
      .accords
      .votes
      .upsert(
        { fragranceId, userId, accordId, vote },
        oc => oc
          .columns(['fragranceId', 'userId', 'accordId'])
          .doUpdateSet({ vote })
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

  private getCount () {
    const { me, args, context } = this

    const { input } = args
    const { services } = context

    const { id } = me
    const { fragranceId } = input
    const { fragrances } = services

    return fragrances
      .accords
      .votes
      .count(
        where => where.and([
          where('fragranceId', '=', fragranceId),
          where('userId', '=', id),
          where('vote', '=', VOTE_TYPES.UPVOTE)
        ])
      )
  }

  private checkCanVote () {
    const { vote } = this.args.input

    return this
      .getCount()
      .andThen(count => {
        if (count >= MAX_ACCORD_VOTES && vote === VOTE_TYPES.UPVOTE) {
          return errAsync(
            new BackendError(
              'MAX_VOTES_REACHED',
              `You can only vote for ${MAX_ACCORD_VOTES} accords per fragrance.`,
              400
            )
          )
        }

        return okAsync(count)
      })
  }
}