import { BaseLoader } from '@src/loaders/BaseLoader.js'
import type { AccordRequestLoadersKey } from '../types.js'
import { throwError, type AccordRequestImageRow, type VoteInfoRow } from '@aromi/shared'
import DataLoader from 'dataloader'

export class AccordRequestLoaders extends BaseLoader<AccordRequestLoadersKey> {
  getImageLoader (): DataLoader<AccordRequestLoadersKey, AccordRequestImageRow | null> {
    const key = this.genKey('image')
    return this
      .getLoader(
        key,
        () => this.createImageLoader()
      )
  }

  getVotesLoader (
    myId?: string | null
  ): DataLoader<AccordRequestLoadersKey, VoteInfoRow> {
    const key = this.genKey('votes')
    return this
      .getLoader(
        key,
        () => this.createVotesLoader(myId)
      )
  }

  private createImageLoader (): DataLoader<AccordRequestLoadersKey, AccordRequestImageRow | null> {
    const { images } = this.services.accordRequests

    return new DataLoader<AccordRequestLoadersKey, AccordRequestImageRow | null>(async keys => {
      return await images
        .find(
          eb => eb.and([
            eb('accordRequestImages.status', '=', 'ready'),
            eb('accordRequestImages.requestId', 'in', keys)
          ])
        )
        .match(
          rows => {
            const map = new Map<string, AccordRequestImageRow>()

            rows.forEach(row => {
              if (!map.has(row.requestId)) map.set(row.requestId, row)
            })

            return keys.map(id => map.get(id) ?? null)
          },
          throwError
        )
    })
  }

  private createVotesLoader (
    myId?: string | null
  ): DataLoader<AccordRequestLoadersKey, VoteInfoRow> {
    const { votes } = this.services.accordRequests

    return new DataLoader<AccordRequestLoadersKey, VoteInfoRow>(async keys => {
      return await votes
        .findVoteInfo(
          eb => eb('accordRequestVotes.requestId', 'in', keys),
          myId
        )
        .match(
          rows => {
            const map = new Map<string, VoteInfoRow>()

            rows.forEach(row => {
              map.set(row.targetId, row)
            })

            return keys.map(id => {
              const voteInfo = map.get(id)
              if (voteInfo != null) {
                return voteInfo
              }

              return {
                targetId: id,
                upvotes: 0,
                downvotes: 0,
                score: 0,
                userVote: null
              }
            })
          },
          throwError
        )
    })
  }
}
