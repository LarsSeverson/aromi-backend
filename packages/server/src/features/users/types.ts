import type { User, UserFollow } from '@src/graphql/gql-types.js'

export interface IUserSummary extends
  Omit<User,
  'avatar' |
  'fragranceRequests' |
  'brandRequests' |
  'accordRequests' |
  'noteRequests' |
  'posts' |
  'collections' |
  'collection' |
  'likes' |
  'reviews' |
  'review' |
  'followerCount' |
  'followingCount' |
  'followers' |
  'following' |
  'relationship'
  > {
  avatarId: string| null
}

export interface IUserFollowSummary extends Omit<UserFollow, 'user'> {
  userId: string
}

export interface UserRelationshipLoaderResult {
  isFollowing: boolean
  isFollowedBy: boolean
}