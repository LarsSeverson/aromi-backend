import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { type AccordEditRow, type BackendError, type EditStatus, EditType, REVISION_JOB_NAMES, unwrapOrThrow, unwrapOrThrowSync } from '@aromi/shared'
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
    await unwrapOrThrow(this.queueRevision(accordEditRow))

    return accordEditRow
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

  private queueRevision (editRow: AccordEditRow) {
    return this
      .createJob(editRow)
      .andThen(() => this.enqueueJob(editRow))
  }

  private createJob (editRow: AccordEditRow) {
    const { context } = this
    const { services } = context

    const { accords } = services

    return accords
      .edits
      .jobs
      .createOne({ editId: editRow.id, editType: EditType.ACCORD })
  }

  private enqueueJob (editRow: AccordEditRow) {
    const { context } = this
    const { queues } = context

    const { revisions } = queues

    return revisions
      .enqueue({
        jobName: REVISION_JOB_NAMES.REVISE_ACCORD,
        data: { editId: editRow.id }
      })
  }

}