import { RequestMutationResolver } from '@src/features/requests/helpers/RequestMutationResolver.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { okAsync, type ResultAsync } from 'neverthrow'
import type { IFragranceRequestSummary } from '../types.js'
import { type FragranceService, unwrapOrThrow, type BackendError } from '@aromi/shared'
import { mapFragranceRequestRowToFragranceRequest } from '../utils/mappers.js'
import { mapGQLNoteLayerToDBNoteLayer } from '@src/features/fragrances/utils/mappers.js'

type Mutation = MutationResolvers['setFragranceRequestNotes']

export class SetFragranceRequestNotesResolver extends RequestMutationResolver<Mutation> {
  private trxService?: FragranceService

  resolve (): ResultAsync<IFragranceRequestSummary, BackendError> {
    const { services } = this.context
    const { fragrances } = services

    return fragrances
      .withTransactionAsync(async trx => {
        this.trxService = trx
        return await this.handleSetNotes()
      })
      .map(({ request }) => mapFragranceRequestRowToFragranceRequest(request))
  }

  private async handleSetNotes () {
    const request = await unwrapOrThrow(this.handleUpdateRequest())
    const notes = await unwrapOrThrow(this.handleUpdateNotes())

    return { request, notes }
  }

  private handleUpdateRequest () {
    const { requestId } = this.args.input

    const values = {
      updatedAt: new Date().toISOString()
    }

    return this
      .trxService!
      .requests
      .updateOne(
        eb => eb('id', '=', requestId),
        eb => ({
          ...values,
          version: eb(eb.ref('version'), '+', 1)
        })
      )
      .andThen(request => this.authorizeEdit(request))
  }

  private handleUpdateNotes () {
    return this
      .handleSoftDeleteOld()
      .andThen(() => this.handleUpsertNew())
  }

  private handleSoftDeleteOld () {
    const { requestId, layer } = this.args.input
    const dbLayer = mapGQLNoteLayerToDBNoteLayer(layer)

    return this
      .trxService!
      .requests
      .notes
      .softDelete(
        eb => eb.and([
          eb('requestId', '=', requestId),
          eb('layer', '=', dbLayer)
        ])
      )
  }

  private handleUpsertNew () {
    const { requestId, noteIds, layer } = this.args.input
    const dbLayer = mapGQLNoteLayerToDBNoteLayer(layer)

    if (noteIds.length === 0) {
      return okAsync([])
    }

    const insertValues = noteIds.map((noteId) => ({
      requestId,
      noteId,
      layer: dbLayer
    }))

    return this
      .trxService!
      .requests
      .notes
      .upsert(
        insertValues,
        oc => oc
          .columns(['requestId', 'noteId', 'layer'])
          .doUpdateSet({ deletedAt: null })
      )
  }
}