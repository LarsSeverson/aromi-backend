export interface VoteInfoRow {
  targetId: string

  upvotes: number
  downvotes: number
  score: number
  userVote: number | null
}
