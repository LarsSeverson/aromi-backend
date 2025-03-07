import { voteOnFragrance } from './fragrance/vote-on-fragrance'
import { voteOnAccord } from './fragrance/vote-on-accord'
import { voteOnNote } from './fragrance/vote-on-note'
import { voteOnTrait } from './fragrance/vote-on-trait'
import { upsertUser } from './user/upsertUser'
import { reviewFragrance } from './fragrance/review-fragrance'
import { voteOnReview } from './fragrance/vote-on-review'
import { type MutationResolvers } from '@src/generated/gql-types'
import { createCollection } from './user/createCollection'
import { addFragranceToCollection } from './fragrance/add-fragrance-to-collection'

export const Mutation: MutationResolvers = {
  voteOnFragrance,
  voteOnTrait,
  voteOnAccord,
  voteOnNote,
  voteOnReview,
  reviewFragrance,
  addFragranceToCollection,

  upsertUser,
  createCollection
}
