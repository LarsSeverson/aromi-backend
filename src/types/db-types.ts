export interface VoteInfoRow {
  targetId: string

  upvotes: number
  downvotes: number
  score: number
  myVote: number | null
}
