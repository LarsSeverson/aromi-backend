import { BaseLoader } from '@src/server/loaders/BaseLoader'
import { type FragranceRequestLoadersKey } from '../types'
import { type FragranceRequestImageRow } from '@src/db/features/fragranceRequests/types'
import DataLoader from 'dataloader'
import { throwError } from '@src/utils/error'
import { type VoteInfoRow } from '@src/db/types'

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
        .findVoteInfo(
          eb => eb('fragranceRequestVotes.requestId', 'in', keys),
          myId
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
                userVote: null
              }
            })
          },
          throwError
        )
    })
  }
}
