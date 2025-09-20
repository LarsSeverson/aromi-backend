import { BaseLoader } from '@src/loaders/BaseLoader.js'
import type { BrandRequestLoadersKey } from '../types.js'
import { type VoteInfoRow, unwrapOrThrow } from '@aromi/shared'
import DataLoader from 'dataloader'

export class BrandRequestLoaders extends BaseLoader<BrandRequestLoadersKey> {
  getVotesLoader (
    userId?: string | null
  ): DataLoader<BrandRequestLoadersKey, VoteInfoRow> {
    const key = this.genKey('votes')
    return this
      .getLoader(
        key,
        () => this.createVotesLoader(userId)
      )
  }

  private createVotesLoader (
    userId?: string | null
  ): DataLoader<BrandRequestLoadersKey, VoteInfoRow> {
    const { votes } = this.services.brands.requests

    return new DataLoader<BrandRequestLoadersKey, VoteInfoRow>(async keys => {
      const voteInfos = await unwrapOrThrow(
        votes.findVoteInfo(
          eb => eb('brandRequestVotes.requestId', 'in', keys),
          userId
        )
      )

      const map = new Map<string, VoteInfoRow>()

      voteInfos.forEach(row => {
        map.set(row.targetId, row)
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
