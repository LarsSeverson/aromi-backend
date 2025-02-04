import { reactToFragrance } from './fragrance/reactToFragrance'
import { voteOnAccord } from './fragrance/voteOnAccord'
import { voteOnNote } from './fragrance/voteOnNote'
import { voteOnTrait } from './fragrance/voteOnTrait'
import { upsertUser } from './user/upsertUser'

export const Mutation = {
  reactToFragrance,

  voteOnTrait,
  voteOnAccord,
  voteOnNote,

  upsertUser
}
