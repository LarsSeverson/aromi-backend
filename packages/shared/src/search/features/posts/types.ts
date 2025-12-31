import type { FragranceRow, PostCommentRow, PostRow, UserRow } from '@src/db/index.js'

export interface PostDocUser {
  id: string
  username: string
}

export interface PostDocFragrance {
  id: string
  name: string
}

export interface PostDoc extends PostRow {
  user: PostDocUser
  fragrance?: PostDocFragrance | null
}

export interface PostFromRowParams {
  post: PostRow
  user: UserRow
  fragrance?: FragranceRow | null
}

export interface PostCommentDocUser {
  id: string
  username: string
}

export interface PostCommentDoc extends PostCommentRow {
  user: PostCommentDocUser
}

export interface PostCommentFromRowParams {
  comment: PostCommentRow
  user: UserRow
}