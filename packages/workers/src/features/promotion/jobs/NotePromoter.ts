import { AssetStatus, BackendError, type NoteImageRow, type NoteRequestImageRow, type NoteRequestRow, type NoteRow, type PROMOTION_JOB_NAMES, type PromotionJobPayload, RequestStatus, ValidNote } from '@aromi/shared'
import { err, errAsync, ok, type Result, type ResultAsync } from 'neverthrow'
import type z from 'zod'
import { BasePromoter } from './BasePromoter.js'
import type { Job } from 'bullmq'

type JobKey = typeof PROMOTION_JOB_NAMES.PROMOTE_NOTE

export class NotePromoter extends BasePromoter<PromotionJobPayload[JobKey], NoteRow> {
  promote (job: Job<PromotionJobPayload[JobKey]>): ResultAsync<NoteRow, BackendError> {
    const { search } = this.context.services
    const { requestId } = job.data

    return this
      .withTransaction(trxPromoter => trxPromoter
        .getNoteRequest(requestId)
        .andThen(row => trxPromoter
          .promoteNote(row)
          .orTee(error => trxPromoter.markFailed(row, error))
        )
      )
      .andTee(note => search
        .notes
        .addDocument(note)
      )
  }

  private getNoteRequest (id: string): ResultAsync<NoteRequestRow, BackendError> {
    const { services } = this.context
    const { noteRequests } = services

    return noteRequests
      .findOne(
        eb => eb('id', '=', id)
      )
  }

  private validateRow (row: NoteRequestRow): Result<z.output<typeof ValidNote>, BackendError> {
    const { data, success, error } = ValidNote.safeParse(row)
    if (!success) {
      return err(BackendError.fromZod(error))
    }

    return ok(data)
  }

  private promoteNote (row: NoteRequestRow): ResultAsync<NoteRow, BackendError> {
    const { services } = this.context
    const { notes } = services

    const validRow = this.validateRow(row)
    if (validRow.isErr()) return errAsync(validRow.error)

    return notes
      .createOne(validRow.value)
      .andThrough(note => this
        .promoteImage(row, note)
      )
  }

  private promoteImage (
    request: NoteRequestRow,
    note: NoteRow
  ): ResultAsync<NoteImageRow, BackendError> {
    const { services } = this.context
    const { notes } = services

    return this
      .getImage(request)
      .andThen(image => {
        const { id: noteId } = note
        const { s3Key, name, contentType, sizeBytes } = image

        return notes
          .images
          .createOne({
            noteId,
            s3Key,
            name,
            contentType,
            sizeBytes
          })
      })
  }

  private getImage (row: NoteRequestRow): ResultAsync<NoteRequestImageRow, BackendError> {
    const { services } = this.context
    const { noteRequests } = services

    return noteRequests
      .images
      .findOne(
        eb => eb.and([
          eb('requestId', '=', row.id),
          eb('status', '=', AssetStatus.READY)
        ])
      )
  }

  private markFailed (row: NoteRequestRow, error: BackendError): ResultAsync<never, BackendError> {
    const { services } = this.context
    const { noteRequests } = services

    return noteRequests
      .updateOne(
        eb => eb('id', '=', row.id),
        {
          requestStatus: RequestStatus.FAILED,
          updatedAt: new Date().toISOString()
        }
      )
      .andThen(() => errAsync(error))
  }
}
