import { BaseLoader } from '@src/loaders/BaseLoader.js'
import type { FragranceRequestLoadersKey } from '../types.js'
import DataLoader from 'dataloader'
import { AssetStatus, type db, utils } from '@aromi/shared'

export class FragranceRequestLoaders extends BaseLoader<FragranceRequestLoadersKey> {
  getImageLoader (): DataLoader<FragranceRequestLoadersKey, db.FragranceRequestImageRow | null> {
    const key = this.genKey('image')
    return this
      .getLoader(
        key,
        () => this.createImageLoader()
      )
  }

  getVotesLoader (
    myId?: string | null
  ): DataLoader<FragranceRequestLoadersKey, db.VoteInfoRow> {
    const key = this.genKey('votes')
    return this
      .getLoader(
        key,
        () => this.createVotesLoader(myId)
      )
  }

  private createImageLoader (): DataLoader<FragranceRequestLoadersKey, db.FragranceRequestImageRow | null> {
    const { images } = this.services.fragranceRequests

    return new DataLoader<FragranceRequestLoadersKey, db.FragranceRequestImageRow | null>(async keys => {
      return await images
        .find(
          eb => eb.and([
            eb('fragranceRequestImages.status', '=', AssetStatus.READY),
            eb('fragranceRequestImages.requestId', 'in', keys)
          ])
        )
        .match(
          rows => {
            const map = new Map<string, db.FragranceRequestImageRow>()

            rows.forEach(row => {
              if (!map.has(row.requestId)) map.set(row.requestId, row)
            })

            return keys.map(id => map.get(id) ?? null)
          },
          utils.throwError
        )
    })
  }

  private createVotesLoader (
    myId?: string | null
  ): DataLoader<FragranceRequestLoadersKey, db.VoteInfoRow> {
    const { votes } = this.services.fragranceRequests

    return new DataLoader<FragranceRequestLoadersKey, db.VoteInfoRow>(async keys => {
      return await votes
        .findVoteInfo(
          eb => eb('fragranceRequestVotes.requestId', 'in', keys),
          myId
        )
        .match(
          rows => {
            const map = new Map<string, db.VoteInfoRow>()

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
          utils.throwError
        )
    })
  }
}
