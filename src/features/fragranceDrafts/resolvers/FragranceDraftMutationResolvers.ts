import { type MutationResolvers } from '@src/generated/gql-types'
import { BaseResolver } from '@src/resolvers/BaseResolver'
import { mapCreateFragranceDraftInputToRow, mapFragranceDraftRowToFragranceDraft, mapUpdateFragranceDraftInputToRow } from '@src/features/fragranceDrafts/utils/mappers'
import { throwError } from '@src/common/error'

export class FragranceDraftMutationResolvers extends BaseResolver<MutationResolvers> {
  createFragranceDraft: MutationResolvers['createFragranceDraft'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { fragranceDrafts } = services
    const values = mapCreateFragranceDraftInputToRow(input)

    return await fragranceDrafts
      .create({ ...values, userId: me.id })
      .match(
        mapFragranceDraftRowToFragranceDraft,
        throwError
      )
  }

  updateFragranceDraft: MutationResolvers['updateFragranceDraft'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { id, version } = input
    const { fragranceDrafts } = services
    const values = mapUpdateFragranceDraftInputToRow(input)

    return await fragranceDrafts
      .updateOne(
        eb => eb.and([
          eb('id', '=', id),
          eb('userId', '=', me.id),
          eb('version', '=', version)
        ]),
        eb => ({
          ...values,
          version: eb(eb.ref('version'), '+', 1)
        })
      )
      .match(
        mapFragranceDraftRowToFragranceDraft,
        throwError
      )
  }

  deleteFragranceDraft: MutationResolvers['deleteFragranceDraft'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { id } = input
    const { fragranceDrafts } = services

    return await fragranceDrafts
      .softDeleteOne(
        eb => eb.and([
          eb('id', '=', id),
          eb('userId', '=', me.id)
        ])
      )
      .match(
        mapFragranceDraftRowToFragranceDraft,
        throwError
      )
  }

  getResolvers (): MutationResolvers {
    return {
      createFragranceDraft: this.createFragranceDraft,
      updateFragranceDraft: this.updateFragranceDraft,
      deleteFragranceDraft: this.deleteFragranceDraft
    }
  }
}
