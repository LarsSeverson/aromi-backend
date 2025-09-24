import { BackendError, EditStatus, type NoteEditRow, REVISION_JOB_NAMES, unwrapOrThrow, unwrapOrThrowSync } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { ResultAsync } from 'neverthrow'

type Mutation = MutationResolvers['reviewNoteEdit']

export class ReviewNoteEditResolver extends MutationResolver<Mutation> {
  resolve () {
    return ResultAsync
      .fromPromise(
        this.handleReviewNoteEdit(),
        error => error as BackendError
      )
  }

  private async handleReviewNoteEdit () {
    unwrapOrThrowSync(this.checkAdminAuthorized())

    const edit = await unwrapOrThrow(this.getEdit())
    this.checkCanEdit(edit)

    const updated = await unwrapOrThrow(this.updateRow())

    if (updated.status === EditStatus.APPROVED) {
      await this.enqueueRevision(updated)
    }

    return updated
  }

  private getEdit () {
    const { args, context } = this
    const { services } = context
    const { notes } = services
    const { editId } = args.input

    return notes
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
    const { notes } = services
    const reviewedBy = me.id

    const values: Partial<NoteEditRow> = {
      reviewedBy,
      status: status as EditStatus,
      reviewerFeedback: feedback,
      reviewedAt: new Date().toISOString()
    }

    return notes
      .edits
      .updateOne(
        eb => eb('id', '=', editId),
        values
      )
  }

  private enqueueRevision (editRow: NoteEditRow) {
    const { context } = this
    const { queues } = context

    const { revisions } = queues

    return revisions
      .enqueue({
        jobName: REVISION_JOB_NAMES.REVISE_NOTE,
        data: { editId: editRow.id }
      })
  }

  private checkCanEdit (editRow: NoteEditRow) {
    if (editRow.status !== EditStatus.PENDING) {
      throw new BackendError(
        'CANNOT_REVIEW_EDIT',
        'Only pending edits can be reviewed',
        400
      )
    }
  }
}