import { type NoteRequestImageRow, type NoteRequestRow, type NoteRow, type NoteImageRow, ValidNote } from '@src/db'
import { ApiError, partitionResults } from '@src/utils/error'
import { err, errAsync, ok, type Result, type ResultAsync } from 'neverthrow'
import { BasePromoter } from './BasePromoter'
import type z from 'zod'

export class NotePromoter extends BasePromoter<NoteRequestRow, NoteRow> {
  async promote (rows: NoteRequestRow[]): Promise<[NoteRow[], NoteRequestRow[]]> {
    const results = await Promise.all(rows
      .map(row => this
        .promoteNote(row)
        .orTee(error => this.markFailed(row, error))
        .mapErr(() => row)
      )
    )

    return partitionResults(results)
  }

  private validateRow (row: NoteRequestRow): Result<z.output<typeof ValidNote>, ApiError> {
    const { data, success, error } = ValidNote.safeParse(row)
    if (!success) {
      return err(ApiError.fromZod(error))
    }

    return ok(data)
  }

  private promoteNote (row: NoteRequestRow): ResultAsync<NoteRow, ApiError> {
    const { services } = this.context
    const { notes } = services

    const validRow = this.validateRow(row)
    if (validRow.isErr()) return errAsync(validRow.error)

    return notes
      .withTransaction(trxService => trxService
        .create(validRow.value)
        .andThrough(note => this
          .promoteImage(row, note)
        )
      )
  }

  private promoteImage (
    request: NoteRequestRow,
    note: NoteRow
  ): ResultAsync<NoteImageRow, ApiError> {
    const { services } = this.context
    const { notes } = services

    return this
      .getImage(request)
      .andThen(image => {
        const { id: noteId } = note
        const { s3Key, name, contentType, sizeBytes } = image

        return notes
          .images
          .create({
            noteId,
            s3Key,
            name,
            contentType,
            sizeBytes
          })
      })
  }

  private getImage (row: NoteRequestRow): ResultAsync<NoteRequestImageRow, ApiError> {
    const { services } = this.context
    const { noteRequests } = services

    return noteRequests
      .images
      .findOne(
        eb => eb.and([
          eb('requestId', '=', row.id),
          eb('status', '=', 'ready')
        ])
      )
  }

  private markFailed (row: NoteRequestRow, error: ApiError): ResultAsync<never, ApiError> {
    const { services } = this.context
    const { noteRequests } = services

    return noteRequests
      .updateOne(
        eb => eb('id', '=', row.id),
        {
          requestStatus: 'FAILED',
          updatedAt: new Date().toISOString()
        }
      )
      .andThen(() => errAsync(error))
  }
}
