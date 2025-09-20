import { BaseLoader } from '@src/loaders/BaseLoader.js'
import type { NoteRequestLoadersKey } from '../types.js'
import type { VoteInfoRow } from '@aromi/shared'
import DataLoader from 'dataloader'
import { unwrapOrThrow } from '@aromi/shared'

export class NoteRequestLoaders extends BaseLoader<NoteRequestLoadersKey> {
  getVotesLoader (
    userId?: string | null
  ): DataLoader<NoteRequestLoadersKey, VoteInfoRow> {
    const key = this.genKey('votes')
    return this
      .getLoader(
        key,
        () => this.createVotesLoader(userId)
      )
  }

  private createVotesLoader (
    userId?: string | null
  ): DataLoader<NoteRequestLoadersKey, VoteInfoRow> {
    const { votes } = this.services.notes.requests

    return new DataLoader<NoteRequestLoadersKey, VoteInfoRow>(async keys => {
      const voteInfos = await unwrapOrThrow(
        votes.findVoteInfo(
          eb => eb('noteRequestVotes.requestId', 'in', keys),
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
