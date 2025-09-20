import { type DataSources, EditType, type BrandRow, type REVISION_JOB_NAMES, type RevisionJobPayload, type BrandEditRow, BackendError, EditStatus, removeNullish, type AssetUploadRow, unwrapOrThrow, type PartialWithId, type BrandIndex, INDEXATION_JOB_NAMES } from '@aromi/shared'
import { BaseReviser } from './BaseReviser.js'
import { errAsync, okAsync } from 'neverthrow'
import type { Job } from 'bullmq'

type JobKey = typeof REVISION_JOB_NAMES.REVISE_BRAND

export class BrandReviser extends BaseReviser<RevisionJobPayload[JobKey], BrandRow> {
  constructor (sources: DataSources) {
    super({ sources, type: EditType.BRAND })
  }

  async revise (job: Job<RevisionJobPayload[JobKey]>): Promise<BrandRow> {
    const { editId } = job.data

    const { brand, newValues } = await this.withTransactionAsync(
      async reviser => await reviser.handleRevise(editId)
    )

    const indexValues = { id: brand.id, ...newValues }
    await this.queueIndex(indexValues)

    return brand
  }

  private async handleRevise (editId: string) {
    const editRow = await unwrapOrThrow(this.getEditRow(editId))
    const { brand, newValues } = await unwrapOrThrow(this.applyEdit(editRow))
    await unwrapOrThrow(this.copyAvatar(editRow))

    return { brand, newValues }
  }

  private queueIndex (data: PartialWithId<BrandIndex>) {
    const { context } = this
    const { queues } = context

    return queues
      .indexation
      .enqueue({
        jobName: INDEXATION_JOB_NAMES.UPDATE_BRAND,
        data
      })
  }

  private applyEdit (edit: BrandEditRow) {
    const { context } = this
    const { services } = context

    const { brandId } = edit
    const values = this.getBrandRevisionValues(edit)
    const { brands } = services

    return brands
      .updateOne(
        eb => eb('id', '=', brandId),
        values
      )
      .map(brand => ({ brand, newValues: values }))
  }

  private copyAvatar (edit: BrandEditRow) {
    const { brandId, proposedAvatarId } = edit

    if (proposedAvatarId == null) return okAsync(null)

    return this
      .getAvatarRow(proposedAvatarId)
      .andThen(avatar => this.copyAvatarToBrand(brandId, avatar))
  }

  private copyAvatarToBrand (
    brandId: string,
    avatar: AssetUploadRow
  ) {
    const { context } = this
    const { services } = context
    const { s3Key, name, contentType, sizeBytes } = avatar
    const { brands } = services

    return brands
      .images
      .createOne(
        { brandId, s3Key, name, contentType, sizeBytes }
      )
  }

  private getEditRow (id: string) {
    const { services } = this.context
    const { brands } = services

    return brands
      .edits
      .findOne(eb => eb('id', '=', id))
      .andThen(edit => this.validateEdit(edit))
  }

  private getAvatarRow (id: string) {
    const { services } = this.context
    const { assets } = services

    return assets
      .uploads
      .findOne(eb => eb('id', '=', id))
  }

  private getBrandRevisionValues (edit: BrandEditRow) {
    const {
      proposedName,
      proposedDescription,
      proposedWebsite
    } = edit

    const dirtyValues: Partial<BrandRow> = {
      name: proposedName ?? undefined,
      description: proposedDescription,
      website: proposedWebsite
    }

    const cleanedValues = removeNullish(dirtyValues)

    return cleanedValues
  }

  private validateEdit (edit: BrandEditRow) {
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