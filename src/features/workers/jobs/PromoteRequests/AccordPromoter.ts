import { type AccordRequestImageRow, ValidAccord, type AccordRequestRow, type AccordRow, type AccordImageRow } from '@src/db'
import { ApiError, partitionResults } from '@src/utils/error'
import { err, errAsync, ok, type Result, type ResultAsync } from 'neverthrow'
import { BasePromoter } from './BasePromoter'
import type z from 'zod'

export class AccordPromoter extends BasePromoter<AccordRequestRow, AccordRow> {
  async promote (rows: AccordRequestRow[]): Promise<[AccordRow[], AccordRequestRow[]]> {
    const results = await Promise.all(rows
      .map(row => this
        .promoteAccord(row)
        .orTee(error => this.markFailed(row, error))
        .mapErr(() => row)
      )
    )

    return partitionResults(results)
  }

  private validateRow (row: AccordRequestRow): Result<z.output<typeof ValidAccord>, ApiError> {
    const { data, success, error } = ValidAccord.safeParse(row)
    if (!success) {
      return err(ApiError.fromZod(error))
    }

    return ok(data)
  }

  private promoteAccord (row: AccordRequestRow): ResultAsync<AccordRow, ApiError> {
    const { services } = this.context
    const { accords } = services

    const validRow = this.validateRow(row)
    if (validRow.isErr()) return errAsync(validRow.error)

    return accords
      .withTransaction(trxService => trxService
        .create(validRow.value)
        .andThrough(accord => this
          .promoteImage(row, accord)
        )
      )
  }

  private promoteImage (
    request: AccordRequestRow,
    accord: AccordRow
  ): ResultAsync<AccordImageRow, ApiError> {
    const { services } = this.context
    const { accords } = services

    return this
      .getImage(request)
      .andThen(image => {
        const { id: accordId } = accord
        const { s3Key, name, contentType, sizeBytes } = image

        return accords
          .images
          .create({
            accordId,
            s3Key,
            name,
            contentType,
            sizeBytes
          })
      }
      )
  }

  private getImage (row: AccordRequestRow): ResultAsync<AccordRequestImageRow, ApiError> {
    const { services } = this.context
    const { accordRequests } = services

    return accordRequests
      .images
      .findOne(
        eb => eb.and([
          eb('requestId', '=', row.id),
          eb('status', '=', 'ready')
        ])
      )
  }

  private markFailed (row: AccordRequestRow, error: ApiError): ResultAsync<never, ApiError> {
    const { services } = this.context
    const { accordRequests } = services

    return accordRequests
      .updateOne(
        eb => eb('id', '=', row.id),
        { requestStatus: 'FAILED' }
      )
      .andThen(() => errAsync(error))
  }
}
