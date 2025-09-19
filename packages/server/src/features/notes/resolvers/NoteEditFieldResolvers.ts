import { unwrapOrThrow } from '@aromi/shared'
import { mapUserRowToUserSummary } from '@src/features/users/utils/mappers.js'
import type { NoteEditResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'

export class NoteEditFieldResolvers extends BaseResolver<NoteEditResolvers> {
  note: NoteEditResolvers['note'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { noteId } = parent
    const { services } = context

    const { notes } = services

    const row = await unwrapOrThrow(
      notes
        .findOne(n => n('id', '=', noteId))
    )

    return row
  }

  user: NoteEditResolvers['user'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { userId } = parent
    const { services } = context

    const { users } = services

    const row = await unwrapOrThrow(
      users
        .findOne(u => u('id', '=', userId))
    )

    return mapUserRowToUserSummary(row)
  }

  reviewer: NoteEditResolvers['reviewer'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { reviewedBy } = parent
    if (reviewedBy == null) return null

    const { services } = context

    const { users } = services

    const row = await unwrapOrThrow(
      users
        .findOne(u => u('id', '=', reviewedBy))
    )

    return mapUserRowToUserSummary(row)
  }

  proposedThumbnail: NoteEditResolvers['proposedThumbnail'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { proposedThumbnailId } = parent
    if (proposedThumbnailId == null) return null

    const { services } = context

    const { assets } = services

    const row = await unwrapOrThrow(
      assets
        .uploads
        .findOne(eb => eb('id', '=', proposedThumbnailId))
    )

    return row
  }

  getResolvers (): NoteEditResolvers {
    return {
      note: this.note,
      user: this.user,
      reviewer: this.reviewer,
      proposedThumbnail: this.proposedThumbnail
    }
  }
}