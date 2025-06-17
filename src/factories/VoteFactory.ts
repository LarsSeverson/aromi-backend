export class VoteFactory {
  value (
    vote: boolean | null | undefined
  ): [number, string | null] {
    const voteValue = vote == null ? 0 : vote ? 1 : -1
    const deletedAt = vote == null ? new Date().toISOString() : null
    return [voteValue, deletedAt]
  }

  delta (
    prev: number,
    next: number
  ): [number, number] {
    const likeDelta = (next === 1 ? 1 : 0) - (prev === 1 ? 1 : 0)
    const dislikeDelta = (next === -1 ? 1 : 0) - (prev === -1 ? 1 : 0)
    return [likeDelta, dislikeDelta]
  }
}
