import { GQLTraitToDBTrait } from '@src/features/traits/utils/mappers'
import { type MutationResolvers } from '@src/generated/gql-types'
import { BaseResolver } from '@src/resolvers/BaseResolver'
import { mapFragranceDraftRowToFragranceDraft } from '../utils/mappers'
import { throwError } from '@src/common/error'

export class FragranceDraftTraitMutationResolvers extends BaseResolver<MutationResolvers> {
  setFragranceDraftTrait: MutationResolvers['setFragranceDraftTrait'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { draftId, version, score, traitType } = input
    const dbTraitType = GQLTraitToDBTrait[traitType]
    const { fragranceDrafts } = services

    const values = {
      updatedAt: new Date().toISOString()
    }

    return await fragranceDrafts
      .withTransaction(() => fragranceDrafts
        .updateOne(
          eb => eb.and([
            eb('id', '=', draftId),
            eb('userId', '=', me.id),
            eb('version', '=', version)
          ]),
          eb => ({
            ...values,
            version: eb(eb.ref('version'), '+', 1)
          })
        )
        .andThrough(() => fragranceDrafts
          .traits
          .upsert(
            eb => ({
              draftId,
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
              .columns(['draftId', 'traitTypeId'])
              .doUpdateSet({
                traitOptionId: eb => eb.ref('excluded.traitOptionId')
              })
          )
        )
      )
      .match(
        mapFragranceDraftRowToFragranceDraft,
        throwError
      )
  }

  getResolvers (): MutationResolvers {
    return {
      setFragranceDraftTrait: this.setFragranceDraftTrait
    }
  }
}
