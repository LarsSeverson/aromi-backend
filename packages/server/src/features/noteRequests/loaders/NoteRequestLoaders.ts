import { BaseLoader } from '@src/loaders/BaseLoader'
import { type NoteRequestLoadersKey } from '../types'
import { type NoteRequestImageRow, type VoteInfoRow } from '@aromi/shared'
import DataLoader from 'dataloader'
import { throwError } from '@aromi/shared'

export class NoteRequestLoaders extends BaseLoader<NoteRequestLoadersKey> {
  getImageLoader (): DataLoader<NoteRequestLoadersKey, NoteRequestImageRow | null> {
    const key = this.genKey('image')
    return this
      .getLoader(
        key,
        () => this.createImageLoader()
      )
  }

  getVotesLoader (
    myId?: string | null
  ): DataLoader<NoteRequestLoadersKey, VoteInfoRow> {
    const key = this.genKey('votes')
    return this
      .getLoader(
        key,
        () => this.createVotesLoader(myId)
      )
  }

  private createImageLoader (): DataLoader<NoteRequestLoadersKey, NoteRequestImageRow | null> {
    const { images } = this.services.noteRequests

    return new DataLoader<NoteRequestLoadersKey, NoteRequestImageRow | null>(async keys => {
      return await images
        .find(
          eb => eb.and([
            eb('status', '=', 'ready'),
            eb('requestId', 'in', keys)
          ])
        )
        .match(
          rows => {
            const map = new Map<string, NoteRequestImageRow>()

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
  ): DataLoader<NoteRequestLoadersKey, VoteInfoRow> {
    const { votes } = this.services.noteRequests

    return new DataLoader<NoteRequestLoadersKey, VoteInfoRow>(async keys => {
      return await votes
        .findVoteInfo(
          eb => eb('noteRequestVotes.requestId', 'in', keys)
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
