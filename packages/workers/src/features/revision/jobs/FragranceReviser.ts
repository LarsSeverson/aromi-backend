import { BackendError, EditStatus, EditType, type FragranceEditRow, type DataSources, type FragranceRow, type REVISION_JOB_NAMES, type RevisionJobPayload, removeNullish, type AssetUploadRow, unwrapOrThrow } from '@aromi/shared'
import { BaseReviser } from './BaseReviser.js'
import { errAsync, okAsync } from 'neverthrow'
import type { Job } from 'bullmq'

type JobKey = typeof REVISION_JOB_NAMES.REVISE_FRAGRANCE

export class FragranceReviser extends BaseReviser<RevisionJobPayload[JobKey], FragranceRow> {
  constructor (sources: DataSources) {
    super({ sources, type: EditType.FRAGRANCE })
  }

  async revise (job: Job<RevisionJobPayload[JobKey]>): Promise<FragranceRow> {
    const { editId } = job.data

    const fragranceRow = await this.withTransactionAsync(
      async reviser => await reviser.handleRevise(editId)
    )

    return fragranceRow
  }

  private async handleRevise (editId: string) {
    const editRow = await unwrapOrThrow(this.getEditRow(editId))
    const fragranceRow = await unwrapOrThrow(this.applyEdit(editRow))
    await unwrapOrThrow(this.copyImage(editRow))

    return fragranceRow
  }

  private applyEdit (edit: FragranceEditRow) {
    const { context } = this
    const { services } = context

    const { fragranceId } = edit
    const values = this.getFragranceRevisionValues(edit)
    const { fragrances } = services

    return fragrances
      .updateOne(
        eb => eb('id', '=', fragranceId),
        values
      )
  }

  private copyImage (edit: FragranceEditRow) {
    const { fragranceId, proposedImageId } = edit

    if (proposedImageId == null) return okAsync(null)

    return this
      .getImageRow(proposedImageId)
      .andThen(image => this.copyAssetToImage(fragranceId, image))
  }

  private copyAssetToImage (
    fragranceId: string,
    asset: AssetUploadRow
  ) {
    const { context } = this
    const { services } = context
    const { s3Key, name, contentType, sizeBytes } = asset

    const { fragrances } = services

    return fragrances
      .images
      .createOne(
        { fragranceId, s3Key, name, contentType, sizeBytes }
      )
  }

  private getEditRow (id: string) {
    const { services } = this.context
    const { fragrances } = services

    return fragrances
      .edits
      .findOne(eb => eb('id', '=', id))
      .andThen(edit => this.validateEdit(edit))
  }

  private getImageRow (id: string) {
    const { services } = this.context
    const { assets } = services

    return assets
      .uploads
      .findOne(eb => eb('id', '=', id))
  }

  private getFragranceRevisionValues (edit: FragranceEditRow) {
    const {
      proposedName,
      proposedDescription,
      proposedReleaseYear,
      proposedConcentration,
      proposedStatus
    } = edit

    const dirtValues: Partial<FragranceRow> = {
      name: proposedName ?? undefined,
      description: proposedDescription,
      releaseYear: proposedReleaseYear,
      concentration: proposedConcentration ?? undefined,
      status: proposedStatus ?? undefined
    }

    return removeNullish(dirtValues)
  }

  private validateEdit (edit: FragranceEditRow) {
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