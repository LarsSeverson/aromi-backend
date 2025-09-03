import { type VoteInfo } from '@src/generated/gql-types'
import { type VoteInfoRow } from '@src/types/db-types'

export const mapVoteInfoRowToVoteInfo = (row: VoteInfoRow): VoteInfo => ({
  upvotes: row.upvotes,
  downvotes: row.downvotes,
  score: row.score,
  myVote: row.userVote
})
