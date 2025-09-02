import { BaseLoader } from '@src/loaders/BaseLoader'
import { type FragranceRequestLoadersKey, type FragranceRequestImageRow } from '../types'
import DataLoader from 'dataloader'
import { throwError } from '@src/common/error'
import { type VoteInfoRow } from '@src/types/db-types'

export class FragranceRequestLoaders extends BaseLoader<FragranceRequestLoadersKey> {
  getImageLoader (): DataLoader<FragranceRequestLoadersKey, FragranceRequestImageRow | null> {
    const key = this.genKey('image')
    return this
      .getLoader(
        key,
        () => this.createImageLoader()
      )
  }

  getVotesLoader (
    myId?: string | null
  ): DataLoader<FragranceRequestLoadersKey, VoteInfoRow> {
    const key = this.genKey('votes')
    return this
      .getLoader(
        key,
        () => this.createVotesLoader(myId)
      )
  }

  private createImageLoader (): DataLoader<FragranceRequestLoadersKey, FragranceRequestImageRow | null> {
    const { images } = this.services.fragranceRequests

    return new DataLoader<FragranceRequestLoadersKey, FragranceRequestImageRow | null>(async keys => {
      return await images
        .find(
          eb => eb.and([
            eb('fragranceRequestImages.status', '=', 'ready'),
            eb('fragranceRequestImages.requestId', 'in', keys)
          ])
        )
        .match(
          rows => {
            const map = new Map<string, FragranceRequestImageRow>()

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
  ): DataLoader<FragranceRequestLoadersKey, VoteInfoRow> {
    const { votes } = this.services.fragranceRequests

    return new DataLoader<FragranceRequestLoadersKey, VoteInfoRow>(async keys => {
      return await votes
        .findVoteInfos(
          eb => {
            if (myId != null) {
              return eb.and([
                eb('fragranceRequestVotes.requestId', 'in', keys),
                eb('fragranceRequestVotes.userId', '=', myId)
              ])
            }

            return eb('fragranceRequestVotes.requestId', 'in', keys)
          }
        )
        .match(
          rows => {
            const map = new Map<string, VoteInfoRow>()

            rows.forEach(row => {
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
                myVote: null
              }
            })
          },
          throwError
        )
    })
  }
}
