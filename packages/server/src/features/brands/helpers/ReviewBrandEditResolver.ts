import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { type BackendError, type EditStatus, unwrapOrThrow, unwrapOrThrowSync } from '@aromi/shared'
import { ResultAsync } from 'neverthrow'

type Mutation = MutationResolvers['reviewBrandEdit']

export class ReviewBrandEditResolver extends MutationResolver<Mutation> {
  resolve () {
    return ResultAsync
      .fromPromise(
        this.handleReviewBrandEdit(),
        error => error as BackendError
      )
  }

  private async handleReviewBrandEdit () {
    unwrapOrThrowSync(this.checkAdminAuthorized())

    const brandEditRow = await unwrapOrThrow(this.updateRow())

    return brandEditRow
  }

  private updateRow () {
    const { args, context, me } = this

    const { input } = args
    const { services } = context

    const { editId, status, feedback } = input
    const { brands } = services
    const reviewerId = me.id

    const values = {
      reviewerId,
      status: status as EditStatus,
      reviewerFeedback: feedback,
      reviewdAt: new Date().toISOString()
    }

    return brands
      .edits
      .updateOne(
        eb => eb('id', '=', editId),
        values
      )
  }
}