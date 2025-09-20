import { BaseLoader } from '@src/loaders/BaseLoader.js'
import type { AccordRequestLoadersKey } from '../types.js'
import { unwrapOrThrow, type VoteInfoRow } from '@aromi/shared'
import DataLoader from 'dataloader'

export class AccordRequestLoaders extends BaseLoader<AccordRequestLoadersKey> {
  getVotesLoader (
    userId?: string | null
  ): DataLoader<AccordRequestLoadersKey, VoteInfoRow> {
    const key = this.genKey('votes')
    return this
      .getLoader(
        key,
        () => this.createVotesLoader(userId)
      )
  }

  private createVotesLoader (
    userId?: string | null
  ): DataLoader<AccordRequestLoadersKey, VoteInfoRow> {
    const { votes } = this.services.accords.requests

    return new DataLoader<AccordRequestLoadersKey, VoteInfoRow>(async keys => {
      const voteInfos = await unwrapOrThrow(
        votes
          .findVoteInfo(
            eb => eb('accordRequestVotes.requestId', 'in', keys),
            userId
          )
      )

      const map = new Map<string, VoteInfoRow>()

      voteInfos.forEach(voteInfo => {
        map.set(voteInfo.targetId, voteInfo)
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
