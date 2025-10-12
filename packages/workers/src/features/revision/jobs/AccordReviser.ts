import { type AccordEditRow, BackendError, EditStatus, type AccordRow, type REVISION_JOB_NAMES, type RevisionJobPayload, unwrapOrThrow, type DataSources, EditType, removeNullish, INDEXATION_JOB_NAMES, type PartialWithId, type AccordDoc } from '@aromi/shared'
import { BaseReviser } from './BaseReviser.js'
import type { Job } from 'bullmq'
import { errAsync, okAsync } from 'neverthrow'

type JobKey = typeof REVISION_JOB_NAMES.REVISE_ACCORD

export class AccordReviser extends BaseReviser<RevisionJobPayload[JobKey], AccordRow> {
  constructor (sources: DataSources) {
    super({ sources, type: EditType.ACCORD })
  }

  async revise (job: Job<RevisionJobPayload[JobKey]>): Promise<AccordRow> {
    const { editId } = job.data

    const { accord, newValues } = await this.withTransactionAsync(
      async reviser => await reviser.reviseAccord(editId)
    )

    const indexValues = { id: accord.id, ...newValues }
    await this.queueIndex(indexValues)

    return accord
  }

  private async reviseAccord (editId: string) {
    const editRow = await unwrapOrThrow(this.getEditRow(editId))
    const { accord, newValues } = await unwrapOrThrow(this.applyEdit(editRow))

    return { accord, newValues }
  }

  private queueIndex (data: PartialWithId<AccordDoc>) {
    const { context } = this
    const { queues } = context

    return queues
      .indexations
      .enqueue({
        jobName: INDEXATION_JOB_NAMES.UPDATE_ACCORD,
        data
      })
  }

  private applyEdit (edit: AccordEditRow) {
    const { context } = this
    const { services } = context

    const { accordId } = edit
    const values = this.getAccordRevisionValues(edit)
    const { accords } = services

    return accords
      .updateOne(
        eb => eb('id', '=', accordId),
        values
      )
      .map(accord => ({ accord, newValues: values }))
  }

  private getEditRow (id: string) {
    const { services } = this.context
    const { accords } = services

    return accords
      .edits
      .findOne(eb => eb('id', '=', id))
      .andThen(edit => this.validateEdit(edit))
  }

  private getAccordRevisionValues (edit: AccordEditRow) {
    const {
      proposedName,
      proposedDescription,
      proposedColor
    } = edit

    const dirtyValues: Partial<AccordRow> = {
      name: proposedName ?? undefined,
      description: proposedDescription,
      color: proposedColor ?? undefined
    }

    const cleanedValues = removeNullish(dirtyValues)

    return cleanedValues
  }

  private validateEdit (edit: AccordEditRow) {
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