import { RequestMutationResolver } from '@src/features/requests/helpers/RequestMutationResolver.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import type { IFragranceRequestSummary } from '../types.js'
import type { BackendError, FragranceRequestService } from '@aromi/shared'
import { mapFragranceRequestRowToFragranceRequest } from '../utils/mappers.js'
import type { ResultAsync } from 'neverthrow'

type Mutation = MutationResolvers['setFragranceRequestBrand']

export class SetFRBrandResolver extends RequestMutationResolver<Mutation> {
  private trxService?: FragranceRequestService

  resolve (): ResultAsync<IFragranceRequestSummary, BackendError> {
    const { services } = this.context
    const { fragranceRequests } = services

    return fragranceRequests
      .withTransaction(trx => {
        this.trxService = trx
        return this.handleSetBrand()
      })
      .map(mapFragranceRequestRowToFragranceRequest)
  }

  private handleSetBrand () {
    const { requestId, brandId } = this.args.input

    const values = {
      brandId,
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
}