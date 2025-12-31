import type { DB } from '@src/db/db-schema.js'
import type { Selectable } from 'kysely'

export type PostRow = Selectable<DB['posts']>
export type PostAssetRow = Selectable<DB['postAssets']>
export type PostCommentRow = Selectable<DB['postComments']>
export type PostCommentAssetRow = Selectable<DB['postCommentAssets']>