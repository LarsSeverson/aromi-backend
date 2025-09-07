import { type VoteInfoRow } from '@aromi/shared/db'
import { type VoteInfo } from '@src/graphql/gql-types'

export const mapVoteInfoRowToVoteInfo = (row: VoteInfoRow): VoteInfo => ({
  upvotes: row.upvotes,
  downvotes: row.downvotes,
  score: row.score,
  myVote: row.userVote
})
