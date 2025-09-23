import { type FragranceEditRow, unwrapOrThrow, unwrapOrThrowSync, type BackendError, EditStatus, REVISION_JOB_NAMES } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { ResultAsync } from 'neverthrow'

type Mutation = MutationResolvers['reviewFragranceEdit']

export class ReviewFragranceEditResolver extends MutationResolver<Mutation> {
  resolve () {
    return ResultAsync
      .fromPromise(
        this.handleReviewFragranceEdit(),
        error => error as BackendError
      )
  }

  private async handleReviewFragranceEdit () {
    unwrapOrThrowSync(this.checkAdminAuthorized())

    const fragranceEditRow = await unwrapOrThrow(this.updateRow())

    if (fragranceEditRow.status === EditStatus.APPROVED) {
      await this.enqueueRevision(fragranceEditRow)
    }

    return fragranceEditRow
  }

  private updateRow () {
    const { args, context, me } = this

    const { input } = args
    const { services } = context

    const { editId, status, feedback } = input
    const { fragrances } = services
    const reviewedBy = me.id

    const values: Partial<FragranceEditRow> = {
      reviewedBy,
      status: status as EditStatus,
      reviewerFeedback: feedback,
      reviewedAt: new Date().toISOString()
    }

    return fragrances
      .edits
      .updateOne(
        eb => eb('id', '=', editId),
        values
      )
  }

  private enqueueRevision (editRow: FragranceEditRow) {
    const { context } = this
    const { queues } = context

    const { revisions } = queues

    return revisions
      .enqueue({
        jobName: REVISION_JOB_NAMES.REVISE_FRAGRANCE,
        data: { editId: editRow.id }
      })
  }
}