import { BaseLoader } from '@src/loaders/BaseLoader.js'
import type { FragranceRequestLoadersKey } from '../types.js'
import DataLoader from 'dataloader'
import { unwrapOrThrow, type VoteInfoRow } from '@aromi/shared'

export class FragranceRequestLoaders extends BaseLoader<FragranceRequestLoadersKey> {
  getVotesLoader (
    userId?: string | null
  ): DataLoader<FragranceRequestLoadersKey, VoteInfoRow> {
    const key = this.genKey('votes')
    return this
      .getLoader(
        key,
        () => this.createVotesLoader(userId)
      )
  }

  private createVotesLoader (
    userId?: string | null
  ): DataLoader<FragranceRequestLoadersKey, VoteInfoRow> {
    const { votes } = this.services.fragrances.requests

    return new DataLoader<FragranceRequestLoadersKey, VoteInfoRow>(async keys => {
      const voteInfos = await unwrapOrThrow(
        votes.findVoteInfo(
          eb => eb('fragranceRequestVotes.requestId', 'in', keys),
          userId
        )
      )

      const map = new Map<string, VoteInfoRow>()

      voteInfos.forEach(row => {
        if (!map.has(row.targetId)) map.set(row.targetId, row)
      })

      return keys.map(id => {
        const voteInfo = map.get(id)
        if (voteInfo != null) return voteInfo

        return {
          targetId: id,
          upvotes: 0,
          downvotes: 0,
          score: 0,
          userVote: null
        }
      })
    })
  }
}
