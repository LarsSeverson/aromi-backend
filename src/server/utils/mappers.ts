import { type VoteInfo } from '@generated/gql-types'
import { type VoteInfoRow } from '@src/db'

export const mapVoteInfoRowToVoteInfo = (row: VoteInfoRow): VoteInfo => ({
  upvotes: row.upvotes,
  downvotes: row.downvotes,
  score: row.score,
  myVote: row.userVote
})
