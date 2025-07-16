import { type RawBuilder, sql } from 'kysely'

export class VoteFactory {
  value (
    vote: boolean | null | undefined
  ): [number, string | null, string] {
    const voteValue = vote == null ? 0 : vote ? 1 : -1
    const deletedAt = vote == null ? new Date().toISOString() : null
    const updatedAt = new Date().toISOString()
    return [voteValue, deletedAt, updatedAt]
  }

  getDeltas (
    prev: number,
    next: number
  ): [number, number] {
    const likesDelta = (next === 1 ? 1 : 0) - (prev === 1 ? 1 : 0)
    const dislikesDelta = (next === -1 ? 1 : 0) - (prev === -1 ? 1 : 0)
    return [likesDelta, dislikesDelta]
  }

  getUpdatedValues (
    likesDelta: number,
    dislikesDelta: number
  ): [RawBuilder<number>, RawBuilder<number>, RawBuilder<number>] {
    const newLikesCount = sql<number>`likes_count + ${likesDelta}`
    const newDislikesCount = sql<number>`dislikes_count + ${dislikesDelta}`
    const newVoteScore = sql<number>`(likes_count + ${likesDelta}) - (dislikes_count + ${dislikesDelta})`

    return [newLikesCount, newDislikesCount, newVoteScore]
  }
}
