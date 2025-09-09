import { GQLTraitToDBTrait } from '@src/features/traits/utils/mappers.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapFragranceRequestRowToFragranceRequest } from '../utils/mappers.js'
import { throwError } from '@aromi/shared'

export class FragranceRequestTraitMutationResolvers extends BaseResolver<MutationResolvers> {
  setFragranceRequestTrait: MutationResolvers['setFragranceRequestTrait'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { requestId, version, score, traitType } = input
    const dbTraitType = GQLTraitToDBTrait[traitType]
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
        )
      )
      .match(
        mapFragranceRequestRowToFragranceRequest,
        throwError
      )
  }

  getResolvers (): MutationResolvers {
    return {
      setFragranceRequestTrait: this.setFragranceRequestTrait
    }
  }
}
