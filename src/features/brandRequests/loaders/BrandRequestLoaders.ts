import { BaseLoader } from '@src/loaders/BaseLoader'
import { type BrandRequestLoadersKey, type BrandRequestImageRow } from '../types'
import DataLoader from 'dataloader'
import { throwError } from '@src/common/error'
import { type VoteInfoRow } from '@src/types/db-types'

export class BrandRequestLoaders extends BaseLoader<BrandRequestLoadersKey> {
  getImageLoader (): DataLoader<BrandRequestLoadersKey, BrandRequestImageRow | null> {
    const key = this.genKey('image')
    return this
      .getLoader(
        key,
        () => this.createImageLoader()
      )
  }

  getVotesLoader (
    myId?: string | null
  ): DataLoader<BrandRequestLoadersKey, VoteInfoRow> {
    const key = this.genKey('votes')
    return this
      .getLoader(
        key,
        () => this.createVotesLoader(myId)
      )
  }

  private createImageLoader (): DataLoader<BrandRequestLoadersKey, BrandRequestImageRow | null> {
    const { images } = this.services.brandRequests

    return new DataLoader<BrandRequestLoadersKey, BrandRequestImageRow | null>(async keys => {
      return await images
        .find(
          eb => eb.and([
            eb('brandRequestImages.status', '=', 'ready'),
            eb('brandRequestImages.requestId', 'in', keys)
          ])
        )
        .match(
          rows => {
            const map = new Map<string, BrandRequestImageRow>()

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
  ): DataLoader<BrandRequestLoadersKey, VoteInfoRow> {
    const { votes } = this.services.brandRequests

    return new DataLoader<BrandRequestLoadersKey, VoteInfoRow>(async keys => {
      return await votes
        .findVoteInfos(
          eb => {
            if (myId != null) {
              return eb.and([
                eb('brandRequestVotes.requestId', 'in', keys),
                eb('brandRequestVotes.userId', '=', myId)
              ])
            }

            return eb('brandRequestVotes.requestId', 'in', keys)
          }
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
                myVote: null
              }
            })
          },
          throwError
        )
    })
  }
}
