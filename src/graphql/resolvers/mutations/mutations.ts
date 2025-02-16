import { voteOnFragrance } from './fragrance/voteOnFragrance'
import { voteOnAccord } from './fragrance/voteOnAccord'
import { voteOnNote } from './fragrance/voteOnNote'
import { voteOnTrait } from './fragrance/voteOnTrait'
import { upsertUser } from './user/upsertUser'
import { reviewFragrance } from './fragrance/reviewFragrance'
import { voteOnReview } from './fragrance/voteOnReview'

export const Mutation = {
  voteOnFragrance,
  voteOnTrait,
  voteOnAccord,
  voteOnNote,
  voteOnReview,
  reviewFragrance,

  upsertUser
}
