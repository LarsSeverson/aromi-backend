import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { type BackendError, type EditStatus, unwrapOrThrow, unwrapOrThrowSync } from '@aromi/shared'
import { ResultAsync } from 'neverthrow'

type Mutation = MutationResolvers['reviewAccordEdit']

export class ReviewAccordEditResolver extends MutationResolver<Mutation> {
  resolve () {
    return ResultAsync
      .fromPromise(
        this.handleReviewAccordEdit(),
        error => error as BackendError
      )
  }

  private async handleReviewAccordEdit () {
    unwrapOrThrowSync(this.checkAdminAuthorized())

    const accordEditRow = await unwrapOrThrow(this.updateRow())

    return accordEditRow
  }

  private updateRow () {
    const { args, context, me } = this

    const { input } = args
    const { services } = context

    const { editId, status, feedback } = input
    const { accords } = services
    const reviewerId = me.id

    const values = {
      reviewerId,
      status: status as EditStatus,
      reviewerFeedback: feedback,
      reviewdAt: new Date().toISOString()
    }

    return accords
      .edits
      .updateOne(
        eb => eb('id', '=', editId),
        values
      )
  }
}