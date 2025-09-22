import { unwrapOrThrow, INDEXATION_JOB_NAMES, AGGREGATION_JOB_NAMES, parseOrThrow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { mapGQLNoteLayerToDBNoteLayer } from '../utils/mappers.js'
import { GenericVoteOnEntityInputSchema } from '@src/utils/validation.js'

type Mutation = MutationResolvers['voteOnFragranceNote']

export class VoteOnNoteResolver extends MutationResolver<Mutation> {
  async resolve () {
    const { input } = this.args
    parseOrThrow(GenericVoteOnEntityInputSchema, input)

    const note = await unwrapOrThrow(this.getNote())

    await unwrapOrThrow(this.upsertVote())
    await this.enqueueAggregation()
    await this.enqueueIndex()

    return note
  }

  private enqueueIndex () {
    const { context, args } = this
    const { queues } = context

    const { fragranceId } = args.input

    return queues
      .indexations
      .enqueue({
        jobName: INDEXATION_JOB_NAMES.INDEX_FRAGRANCE,
        data: { fragranceId }
      })
  }

  private enqueueAggregation () {
    const { context, args } = this
    const { queues } = context

    const { fragranceId, noteId, layer } = args.input
    const dbLayer = mapGQLNoteLayerToDBNoteLayer(layer)

    return queues
      .aggregations
      .enqueue({
        jobName: AGGREGATION_JOB_NAMES.AGGREGATE_NOTE_VOTES,
        data: { fragranceId, noteId, layer: dbLayer }
      })
  }

  private upsertVote () {
    const { me, args, context } = this

    const { input } = args
    const { services } = context

    const { fragranceId, noteId, layer, vote } = input
    const userId = me.id
    const dbLayer = mapGQLNoteLayerToDBNoteLayer(layer)

    const { fragrances } = services

    return fragrances
      .notes
      .votes
      .upsert(
        { fragranceId, userId, noteId, layer: dbLayer },
        oc => oc
          .columns(['fragranceId', 'userId', 'noteId', 'layer'])
          .doUpdateSet({ vote })
      )
  }

  private getNote () {
    const { args, context } = this

    const { input } = args
    const { services } = context

    const { noteId } = input
    const { notes } = services

    return notes
      .findOne(
        eb => eb('id', '=', noteId)
      )
  }
}