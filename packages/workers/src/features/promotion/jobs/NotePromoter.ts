import { type AssetUploadRow, BackendError, type DataSources, INDEXATION_JOB_NAMES, type NoteImageRow, type NoteRequestRow, type NoteRow, type PROMOTION_JOB_NAMES, type PromotionJobPayload, RequestStatus, RequestType, unwrapOrThrow, ValidNote } from '@aromi/shared'
import { err, errAsync, ok } from 'neverthrow'
import { BasePromoter } from './BasePromoter.js'
import type { Job } from 'bullmq'

type JobKey = typeof PROMOTION_JOB_NAMES.PROMOTE_NOTE

export class NotePromoter extends BasePromoter<PromotionJobPayload[JobKey], NoteRow> {
  constructor (sources: DataSources) {
    super({ sources, type: RequestType.NOTE })
  }

  async promote (job: Job<PromotionJobPayload[JobKey]>) {
    const { requestId } = job.data

    const note = await this.withTransactionAsync(
      async promoter => await promoter.handlePromote(requestId)
    )

    await this.queueIndex(note.id)

    return note
  }

  private async handlePromote (requestId: string) {
    const request = await unwrapOrThrow(this.updateRequest(requestId))
    const requestThumbnail = await unwrapOrThrow(this.getThumbnail(request))

    const note = await unwrapOrThrow(this.createNote(request))
    const noteThumbnail = await unwrapOrThrow(this.createThumbnail(requestThumbnail, note))
    await unwrapOrThrow(this.linkThumbnail(noteThumbnail, note))

    return note
  }

  private queueIndex (noteId: string) {
    const { context } = this
    const { queues } = context

    return queues
      .indexation
      .enqueue({
        jobName: INDEXATION_JOB_NAMES.INDEX_NOTE,
        data: { noteId }
      })
  }

  private updateRequest (requestId: string) {
    const { services } = this.context
    const { notes } = services

    return notes
      .requests
      .updateOne(
        eb => eb('id', '=', requestId),
        { requestStatus: RequestStatus.ACCEPTED }
      )
  }

  private createNote (row: NoteRequestRow) {
    const { services } = this.context
    const { notes } = services

    const validRow = this.validateRequest(row)
    if (validRow.isErr()) return errAsync(validRow.error)

    return notes.createOne(validRow.value)
  }

  private createThumbnail (
    asset: AssetUploadRow,
    note: NoteRow
  ) {
    const { services } = this.context
    const { notes } = services

    const { id: noteId } = note
    const { s3Key, name, contentType, sizeBytes } = asset

    return notes
      .images
      .createOne({
        noteId,
        s3Key,
        name,
        contentType,
        sizeBytes
      })
  }

  private linkThumbnail (
    thumbnail: NoteImageRow,
    note: NoteRow
  ) {
    const { services } = this.context
    const { notes } = services

    const { id: noteId } = note
    const { id: thumbnailImageId } = thumbnail

    return notes
      .updateOne(
        eb => eb('id', '=', noteId),
        { thumbnailImageId }
      )
  }

  private getThumbnail (request: NoteRequestRow) {
    const { services } = this.context
    const { assets } = services

    return assets
      .uploads
      .findOne(eb => eb('id', '=', request.assetId))
      .mapErr(error => {
        if (error.status === 404) {
          return new BackendError(
            'ASSET_NOT_FOUND',
            'The request thumbnail was not found. This is required to promote a note.',
            400
          )
        }

        return error
      })
  }

  private validateRequest (request: NoteRequestRow) {
    const { data, success, error } = ValidNote.safeParse(request)

    if (!success) {
      return err(
        new BackendError(
          'INVALID_REQUEST_DATA',
          `The request did not pass validation: ${error.message}`,
          400,
          BackendError.fromZod(error)
        )
      )
    }

    return ok(data)
  }
}
