import { voteOnFragrance } from './fragrance/voteOnFragrance'
import { voteOnAccord } from './fragrance/voteOnAccord'
import { voteOnNote } from './fragrance/voteOnNote'
import { voteOnTrait } from './fragrance/voteOnTrait'
import { upsertUser } from './user/upsertUser'

export const Mutation = {
  voteOnFragrance,
  voteOnTrait,
  voteOnAccord,
  voteOnNote,

  upsertUser
}
