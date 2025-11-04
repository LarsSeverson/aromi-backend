export const VOTE_TYPES = {
  UPVOTE: 1,
  DOWNVOTE: -1,
  NOVOTE: 0
} as const

export type VoteType = typeof VOTE_TYPES[keyof typeof VOTE_TYPES]