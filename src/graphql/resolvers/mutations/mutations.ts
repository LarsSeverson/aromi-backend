import { voteOnAccord } from './fragrance/voteOnAccord'
import { voteOnTrait } from './fragrance/voteOnTrait'
import { upsertUser } from './user/upsertUser'

export const Mutation = {
  voteOnTrait,
  voteOnAccord,

  upsertUser
}
