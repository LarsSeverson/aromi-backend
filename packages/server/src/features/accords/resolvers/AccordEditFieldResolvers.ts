import { unwrapOrThrow } from '@aromi/shared'
import { mapUserRowToUserSummary } from '@src/features/users/utils/mappers.js'
import type { AccordEditResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'

export class AccordEditFieldResolvers extends BaseResolver<AccordEditResolvers> {
  accord: AccordEditResolvers['accord'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { accordId } = parent
    const { services } = context

    const { accords } = services

    const row = await unwrapOrThrow(
      accords.findOne(eb => eb('id', '=', accordId))
    )

    return row
  }

  user: AccordEditResolvers['user'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { userId } = parent
    const { services } = context

    const { users } = services

    const row = await unwrapOrThrow(
      users.findOne(eb => eb('id', '=', userId))
    )

    return mapUserRowToUserSummary(row)
  }

  reviewer: AccordEditResolvers['reviewer'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { reviewedBy } = parent
    const { services } = context

    if (reviewedBy == null) return null

    const { users } = services

    const row = await unwrapOrThrow(
      users.findOne(eb => eb('id', '=', reviewedBy))
    )

    return mapUserRowToUserSummary(row)
  }

  getResolvers (): AccordEditResolvers {
    return {
      accord: this.accord,
      user: this.user,
      reviewer: this.reviewer
    }
  }
}