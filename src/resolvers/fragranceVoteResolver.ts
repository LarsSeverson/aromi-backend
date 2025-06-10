import { type FragranceVoteResolvers as FragranceVoteFieldResolvers } from '@src/generated/gql-types'
import { ApiResolver } from './apiResolver'
import { type FragranceVoteSummary } from '@src/schemas/fragrance/mappers'
import { type FragranceVoteRow } from '@src/services/repositories/FragranceVotesRepo'
import { ResultAsync } from 'neverthrow'
import { mapUserRowToUserSummary } from './userResolver'
import { mapFragranceRowToFragranceSummary } from './fragranceResolver'

export class FragranceVoteResolver extends ApiResolver {
  voteUser: FragranceVoteFieldResolvers['user'] = async (parent, args, context, info) => {
    const { userId } = parent
    const { loaders } = context

    return await ResultAsync
      .fromPromise(
        loaders
          .user
          .getUserLoader()
          .load({ userId }),
        error => error
      )
      .match(
        mapUserRowToUserSummary,
        error => { throw error }
      )
  }

  voteFragrance: FragranceVoteFieldResolvers['fragrance'] = async (parent, args, context, info) => {
    const { fragranceId } = parent
    const { loaders } = context

    return await ResultAsync
      .fromPromise(
        loaders
          .fragrance
          .getFragranceLoader()
          .load({ fragranceId }),
        error => error
      )
      .match(
        mapFragranceRowToFragranceSummary,
        error => { throw error }
      )
  }
}

export const mapFragranceVoteRowToFragranceVoteSummary = (row: FragranceVoteRow): FragranceVoteSummary => {
  const {
    id, userId, fragranceId,
    vote,
    createdAt, updatedAt, deletedAt
  } = row

  return {
    id,
    userId,
    fragranceId,
    vote,
    audit: ApiResolver.audit(createdAt, updatedAt, deletedAt)
  }
}
