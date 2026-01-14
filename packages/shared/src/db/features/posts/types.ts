import type { DB } from '@src/db/db-schema.js'
import type { Selectable } from 'kysely'

export type PostRow = Selectable<DB['posts']>
export type PostAssetRow = Selectable<DB['postAssets']>
export type PostCommentRow = Selectable<DB['postComments']>
export type PostCommentAssetRow = Selectable<DB['postCommentAssets']>

export type PostVoteRow = Selectable<DB['postVotes']>
export type PostScoreRow = Selectable<DB['postScores']>

export type PostCommentVoteRow = Selectable<DB['postCommentVotes']>
export type PostCommentScoreRow = Selectable<DB['postCommentScores']>