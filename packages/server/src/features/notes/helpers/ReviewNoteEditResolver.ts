import { type BackendError, EditStatus, EditType, type NoteEditRow, REVISION_JOB_NAMES, unwrapOrThrow, unwrapOrThrowSync } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { okAsync, ResultAsync } from 'neverthrow'

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

    const noteEditRow = await unwrapOrThrow(this.updateRow())
    await unwrapOrThrow(this.handleQueueJob(noteEditRow))

    return noteEditRow
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

  private handleQueueJob (editRow: NoteEditRow) {
    if (editRow.status !== EditStatus.APPROVED) {
      return okAsync(undefined)
    }

    return this
      .createJob(editRow)
      .andThen(() => this.enqueueJob(editRow))
  }

  private createJob (editRow: NoteEditRow) {
    const { context } = this
    const { services } = context

    const { notes } = services

    return notes
      .edits
      .jobs
      .createOne({ editId: editRow.id, editType: EditType.NOTE })
  }

  private enqueueJob (editRow: NoteEditRow) {
    const { context } = this
    const { queues } = context

    const { revisions } = queues

    return revisions
      .enqueue({
        jobName: REVISION_JOB_NAMES.REVISE_NOTE,
        data: { editId: editRow.id }
      })
  }
}