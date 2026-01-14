import type { Post, PostAsset, PostComment, PostCommentAsset } from '@src/graphql/gql-types.js'
import type { CreatePostCommentSchema, CreatePostSchema, UpdatePostCommentSchema, UpdatePostSchema, VoteOnPostCommentInputSchema, VoteOnPostInputSchema } from './utils/validation.js'
import type z from 'zod'

export interface IPost extends Omit<Post,
'assets' | 'user' | 'fragrance' |
'commentCount' | 'comments' | 'searchComments' | 'votes'
> {
  userId: string
  fragranceId?: string | null
}

export interface IPostAsset extends Omit<PostAsset, 'asset' | 'post'> {
  postId: string
  assetId: string
}

export interface IPostComment extends Omit<PostComment,
'parent' | 'post' | 'user' | 'comments' | 'assets' |
'votes' | 'commentCount'
> {
  parentId?: string | null
  postId: string
  userId: string
}

export interface IPostCommentAsset extends Omit<PostCommentAsset, 'asset' | 'PostComment'> {
  commentId: string
  assetId: string
}

export type CreatePostSchemaType = z.infer<typeof CreatePostSchema>
export type CreatePostCommentSchemaType = z.infer<typeof CreatePostCommentSchema>
export type UpdatePostSchemaType = z.infer<typeof UpdatePostSchema>
export type UpdatePostCommentSchemaType = z.infer<typeof UpdatePostCommentSchema>
export type VoteOnPostSchemaType = z.infer<typeof VoteOnPostInputSchema>
export type VoteOnPostCommentSchemaType = z.infer<typeof VoteOnPostCommentInputSchema>