import { DraftPaginationFactory } from '@src/features/drafts/factories/DraftPaginationFactory'
import { type QueryResolvers } from '@src/generated/gql-types'
import { BaseResolver } from '@src/resolvers/BaseResolver'
import { mapFragranceDraftRowToFragranceDraft } from '../utils/mappers'
import { throwError } from '@src/common/error'

export class FragranceDraftQueryResolvers extends BaseResolver<QueryResolvers> {
  private readonly pagination = new DraftPaginationFactory()

  fragranceDraft: QueryResolvers['fragranceDraft'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { id } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { fragranceDrafts } = services

    return await fragranceDrafts
      .findOne(
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

  fragranceDrafts: QueryResolvers['fragranceDrafts'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { fragranceDrafts } = services
    const pagination = this.pagination.parse(input)

    return await fragranceDrafts
      .find(
        eb => eb.and([
          eb('userId', '=', me.id)
        ]),
        { pagination }
      )
      .map(rows => this
        .pageFactory
        .paginate(rows, pagination)
      )
      .match(
        connection => this
          .pageFactory
          .transform(connection, mapFragranceDraftRowToFragranceDraft),
        throwError
      )
  }

  getResolvers (): QueryResolvers {
    return {
      fragranceDraft: this.fragranceDraft,
      fragranceDrafts: this.fragranceDrafts
    }
  }
}
