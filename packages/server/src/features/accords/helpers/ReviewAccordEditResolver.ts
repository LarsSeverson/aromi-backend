import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { type AccordEditRow, BackendError, EditStatus, REVISION_JOB_NAMES, unwrapOrThrow, unwrapOrThrowSync } from '@aromi/shared'
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

    const edit = await unwrapOrThrow(this.getEdit())
    this.checkCanEdit(edit)

    const accordEditRow = await unwrapOrThrow(this.updateRow())

    if (accordEditRow.status === EditStatus.APPROVED) {
      await this.enqueueRevision(accordEditRow)
    }

    return accordEditRow
  }

  private getEdit () {
    const { args, context } = this
    const { services } = context
    const { accords } = services
    const { editId } = args.input

    return accords
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
    const { accords } = services
    const reviewedBy = me.id

    const values: Partial<AccordEditRow> = {
      reviewedBy,
      status: status as EditStatus,
      reviewerFeedback: feedback,
      reviewedAt: new Date().toISOString()
    }

    return accords
      .edits
      .updateOne(
        eb => eb('id', '=', editId),
        values
      )
  }

  private enqueueRevision (editRow: AccordEditRow) {
    const { context } = this
    const { queues } = context

    const { revisions } = queues

    return revisions
      .enqueue({
        jobName: REVISION_JOB_NAMES.REVISE_ACCORD,
        data: { editId: editRow.id }
      })
  }

  private checkCanEdit (editRow: AccordEditRow) {
    if (editRow.status !== EditStatus.PENDING) {
      throw new BackendError(
        'CANNOT_REVIEW_EDIT',
        'Only pending edits can be reviewed',
        400
      )
    }
  }
}