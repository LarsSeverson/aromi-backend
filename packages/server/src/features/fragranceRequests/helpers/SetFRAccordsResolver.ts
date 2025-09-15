import { RequestMutationResolver } from '@src/features/requests/helpers/RequestMutationResolver.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { okAsync, type ResultAsync } from 'neverthrow'
import type { IFragranceRequestSummary } from '../types.js'
import { unwrapOrThrow, type BackendError, type FragranceRequestService } from '@aromi/shared'
import { mapFragranceRequestRowToFragranceRequest } from '../utils/mappers.js'

type Mutation = MutationResolvers['setFragranceRequestAccords']

export class SetFRAccordsResolver extends RequestMutationResolver<Mutation> {
  private trxService?: FragranceRequestService

  resolve (): ResultAsync<IFragranceRequestSummary, BackendError> {
    const { services } = this.context
    const { fragranceRequests } = services

    return fragranceRequests
      .withTransactionAsync(async trx => {
        this.trxService = trx
        return await this.handleSetAccords()
      })
      .map(({ request }) => mapFragranceRequestRowToFragranceRequest(request))
  }

  private async handleSetAccords () {
    const request = await unwrapOrThrow(this.handleUpdateRequest())
    const accords = await unwrapOrThrow(this.handleUpdateAccords())

    return { request, accords }
  }

  private handleUpdateRequest () {
    const { requestId } = this.args.input

    const values = {
      updatedAt: new Date().toISOString()
    }

    return this
      .trxService!
      .updateOne(
        eb => eb('id', '=', requestId),
        eb => ({
          ...values,
          version: eb(eb.ref('version'), '+', 1)
        })
      )
      .andThen(request => this.authorizeEdit(request))
  }

  private handleUpdateAccords () {
    return this
      .handleSoftDeleteOld()
      .andThen(() => this.handleUpsertNew())
  }

  private handleSoftDeleteOld () {
    const { requestId } = this.args.input

    return this
      .trxService!
      .notes
      .softDelete(
        eb => eb.and([
          eb('requestId', '=', requestId)
        ])
      )
  }

  private handleUpsertNew () {
    const { requestId, accordIds } = this.args.input

    if (accordIds.length === 0) {
      return okAsync([])
    }

    const insertValues = accordIds.map((accordId) => ({
      requestId,
      accordId
    }))

    return this
      .trxService!
      .accords
      .upsert(
        insertValues,
        oc => oc
          .columns(['requestId', 'accordId'])
          .doUpdateSet({ deletedAt: null })
      )
  }
}