import { unwrapOrThrow, type BackendError, type FragranceRequestService } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import type { ResultAsync } from 'neverthrow'
import type { IFragranceRequestSummary } from '../types.js'
import { GQLTraitToDBTrait } from '@src/features/traits/utils/mappers.js'
import { RequestMutationResolver } from '@src/features/requests/helpers/RequestMutationResolver.js'
import { mapFragranceRequestRowToFragranceRequest } from '../utils/mappers.js'

type Mutation = MutationResolvers['setFragranceRequestTrait']

export class SetFRTraitResolver extends RequestMutationResolver<Mutation> {
  private trxService?: FragranceRequestService

  resolve (): ResultAsync<IFragranceRequestSummary, BackendError> {
    const { services } = this.context
    const { fragranceRequests } = services

    return fragranceRequests
      .withTransactionAsync(async trx => {
        this.trxService = trx
        return await this.handleSetTrait()
      })
      .map(({ request }) => mapFragranceRequestRowToFragranceRequest(request))
  }

  private async handleSetTrait () {
    const request = await unwrapOrThrow(this.handleUpdateRequest())
    const trait = await unwrapOrThrow(this.handleUpdateTrait())

    return { request, trait }
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

  private handleUpdateTrait () {
    const { requestId, score, traitType } = this.args.input
    const dbTraitType = GQLTraitToDBTrait[traitType]

    return this
      .trxService!
      .traits
      .upsert(
        eb => ({
          requestId,
          traitTypeId: eb
            .selectFrom('traitTypes')
            .select('id')
            .where('name', '=', dbTraitType),
          traitOptionId: eb
            .selectFrom('traitOptions as to')
            .select('to.id')
            .where('to.traitTypeId', '=',
              eb.selectFrom('traitTypes')
                .select('id')
                .where('name', '=', dbTraitType)
            )
            .where('to.score', '=', score)
        }),
        oc => oc
          .columns(['requestId', 'traitTypeId'])
          .doUpdateSet({
            traitOptionId: eb => eb.ref('excluded.traitOptionId')
          })
      )
  }
}