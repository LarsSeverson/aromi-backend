import { voteOnFragrance } from './fragrance/voteOnFragrance'
import { voteOnAccord } from './fragrance/voteOnAccord'
import { voteOnNote } from './fragrance/voteOnNote'
import { voteOnTrait } from './fragrance/voteOnTrait'
import { upsertUser } from './user/upsertUser'
import { reviewFragrance } from './fragrance/reviewFragrance'
import { voteOnReview } from './fragrance/voteOnReview'
import { type MutationResolvers } from '@src/generated/gql-types'

export const Mutation: MutationResolvers = {
  voteOnFragrance,
  voteOnTrait,
  voteOnAccord,
  voteOnNote,
  voteOnReview,
  reviewFragrance,

  upsertUser
}
