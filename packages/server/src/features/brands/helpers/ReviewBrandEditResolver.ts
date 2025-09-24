import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { BackendError, type BrandEditRow, EditStatus, REVISION_JOB_NAMES, unwrapOrThrow, unwrapOrThrowSync } from '@aromi/shared'
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

    const edit = await unwrapOrThrow(this.getEdit())
    this.checkCanEdit(edit)

    const brandEditRow = await unwrapOrThrow(this.updateRow())

    if (brandEditRow.status === EditStatus.APPROVED) {
      await this.enqueueRevision(brandEditRow)
    }

    return brandEditRow
  }

  private getEdit () {
    const { args, context } = this
    const { services } = context
    const { brands } = services
    const { editId } = args.input

    return brands
      .edits
      .findOne(
        eb => eb('id', '=', editId)
      )
  }

  private updateRow () {
    const { args, context, me } = this

    const { input } = args
    const { services } = context

    const { editId, status, feedback } = input
    const { brands } = services
    const reviewedBy = me.id

    const values: Partial<BrandEditRow> = {
      reviewedBy,
      status: status as EditStatus,
      reviewerFeedback: feedback,
      reviewedAt: new Date().toISOString()
    }

    return brands
      .edits
      .updateOne(
        eb => eb('id', '=', editId),
        values
      )
  }

  private enqueueRevision (editRow: BrandEditRow) {
    const { context } = this
    const { queues } = context

    const { revisions } = queues

    return revisions
      .enqueue({
        jobName: REVISION_JOB_NAMES.REVISE_BRAND,
        data: { editId: editRow.id }
      })
  }

  private checkCanEdit (editRow: BrandEditRow) {
    if (editRow.status !== EditStatus.PENDING) {
      throw new BackendError(
        'CANNOT_REVIEW_EDIT',
        'Only pending edits can be reviewed',
        400
      )
    }
  }
}