import { type AssetUploadRow, BackendError, type DataSources, EditStatus, EditType, type NoteEditRow, type NoteRow, removeNullish, type REVISION_JOB_NAMES, type RevisionJobPayload, unwrapOrThrow } from '@aromi/shared'
import { BaseReviser } from './BaseReviser.js'
import { errAsync, okAsync } from 'neverthrow'
import type { Job } from 'bullmq'

type JobKey = typeof REVISION_JOB_NAMES.REVISE_NOTE

export class NoteReviser extends BaseReviser<RevisionJobPayload[JobKey], NoteRow> {
  constructor (sources: DataSources) {
    super({ sources, type: EditType.NOTE })
  }

  async revise (job: Job<RevisionJobPayload[JobKey]>): Promise<NoteRow> {
    const { editId } = job.data

    const noteRow = await this.withTransactionAsync(
      async reviser => await reviser.handleRevise(editId)
    )

    return noteRow
  }

  private async handleRevise (editId: string) {
    const editRow = await unwrapOrThrow(this.getEditRow(editId))
    const noteRow = await unwrapOrThrow(this.applyEdit(editRow))
    await unwrapOrThrow(this.copyThumbnail(editRow))

    return noteRow
  }

  private applyEdit (edit: NoteEditRow) {
    const { context } = this
    const { services } = context

    const { noteId } = edit
    const values = this.getNoteRevisionValues(edit)
    const { notes } = services

    return notes
      .updateOne(
        eb => eb('id', '=', noteId),
        values
      )
  }

  private copyThumbnail (edit: NoteEditRow) {
    const { noteId, proposedThumbnailId } = edit

    if (proposedThumbnailId == null) return okAsync(null)

    return this
      .getThumbnailRow(proposedThumbnailId)
      .andThen(asset => this.copyAssetToThumbnail(noteId, asset))
  }

  private copyAssetToThumbnail (
    noteId: string,
    asset: AssetUploadRow
  ) {
    const { context } = this
    const { services } = context
    const { notes } = services

    const { s3Key, name, contentType, sizeBytes } = asset

    return notes
      .images
      .createOne(
        { noteId, s3Key, name, contentType, sizeBytes }
      )
  }

  private getEditRow (id: string) {
    const { services } = this.context
    const { notes } = services

    return notes
      .edits
      .findOne(eb => eb('id', '=', id))
      .andThen(edit => this.validateEdit(edit))
  }

  private getThumbnailRow (id: string) {
    const { services } = this.context
    const { assets } = services

    return assets
      .uploads
      .findOne(eb => eb('id', '=', id))
  }

  private getNoteRevisionValues (edit: NoteEditRow) {
    const {
      proposedName,
      proposedDescription
    } = edit

    const dirtValues: Partial<NoteRow> = {
      name: proposedName ?? undefined,
      description: proposedDescription
    }

    const cleanedValues = removeNullish(dirtValues)

    return cleanedValues
  }

  private validateEdit (edit: NoteEditRow) {
    if (edit.status !== EditStatus.APPROVED) {
      return errAsync(
        new BackendError(
          'NOT_APPROVED',
          'Only approved edits can be revised',
          400
        )
      )
    }

    return okAsync(edit)
  }
}