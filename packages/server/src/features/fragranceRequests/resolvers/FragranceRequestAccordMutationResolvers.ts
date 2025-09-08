import { type MutationResolvers } from '@src/graphql/gql-types'
import { BaseResolver } from '@src/resolvers/BaseResolver'
import { okAsync } from 'neverthrow'
import { mapFragranceRequestRowToFragranceRequest } from '../utils/mappers'
import { throwError } from '@aromi/shared'

export class FragranceRequestAccordMutationResolvers extends BaseResolver<MutationResolvers> {
  setFragranceRequestAccords: MutationResolvers['setFragranceRequestAccords'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { requestId, version, accordIds } = input
    const { fragranceRequests } = services

    const values = {
      updatedAt: new Date().toISOString()
    }

    return await fragranceRequests
      .withTransaction(trxService => trxService
        .updateOne(
          eb => eb.and([
            eb('id', '=', requestId),
            eb('userId', '=', me.id),
            eb('version', '=', version),
            eb('requestStatus', 'not in', ['ACCEPTED', 'DENIED'])
          ]),
          eb => ({
            ...values,
            version: eb(eb.ref('version'), '+', 1)
          })
        )
        .andThrough(() => trxService
          .accords
          .softDelete(
            eb => eb('requestId', '=', requestId)
          )
          .andThen(() => {
            if (accordIds.length === 0) {
              return okAsync([])
            }

            const insertValues = accordIds.map((accordId) => ({
              requestId,
              accordId
            }))

            return trxService
              .accords
              .upsert(
                insertValues,
                oc => oc
                  .columns(['requestId', 'accordId'])
                  .doUpdateSet({ deletedAt: null })
              )
          })
        )
      )
      .match(
        mapFragranceRequestRowToFragranceRequest,
        throwError
      )
  }

  getResolvers (): MutationResolvers {
    return {
      setFragranceRequestAccords: this.setFragranceRequestAccords
    }
  }
}
