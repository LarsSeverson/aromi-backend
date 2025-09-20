import { RequestMutationResolver } from '@src/features/requests/helpers/RequestMutationResolver.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import type { IFragranceRequestSummary } from '../types.js'
import type { BackendError, FragranceService } from '@aromi/shared'
import { mapFragranceRequestRowToFragranceRequest } from '../utils/mappers.js'
import type { ResultAsync } from 'neverthrow'

type Mutation = MutationResolvers['setFragranceRequestBrand']

export class SetFragranceRequestBrandResolver extends RequestMutationResolver<Mutation> {
  private trxService?: FragranceService

  resolve (): ResultAsync<IFragranceRequestSummary, BackendError> {
    const { services } = this.context
    const { fragrances } = services

    return fragrances
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
}