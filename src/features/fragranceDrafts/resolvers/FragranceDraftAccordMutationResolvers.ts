import { type MutationResolvers } from '@src/generated/gql-types'
import { BaseResolver } from '@src/resolvers/BaseResolver'
import { okAsync } from 'neverthrow'
import { mapFragranceDraftRowToFragranceDraft } from '../utils/mappers'
import { throwError } from '@src/common/error'

export class FragranceDraftAccordMutationResolvers extends BaseResolver<MutationResolvers> {
  setFragranceDraftAccords: MutationResolvers['setFragranceDraftAccords'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { draftId, version, accordIds } = input
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
          .accords
          .softDelete(
            eb => eb('draftId', '=', draftId)
          )
          .andThen(() => {
            if (accordIds.length === 0) {
              return okAsync([])
            }

            const insertValues = accordIds.map((accordId) => ({
              draftId,
              accordId
            }))

            return fragranceDrafts
              .accords
              .upsert(
                insertValues,
                oc => oc
                  .columns(['draftId', 'accordId'])
                  .doUpdateSet({ deletedAt: null })
              )
          })
        )
      )
      .match(
        mapFragranceDraftRowToFragranceDraft,
        throwError
      )
  }

  getResolvers (): MutationResolvers {
    return {
      setFragranceDraftAccords: this.setFragranceDraftAccords
    }
  }
}
