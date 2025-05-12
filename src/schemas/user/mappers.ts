import { type UserCollection, type User } from '@src/generated/gql-types'

export type UserSummary = Omit<User,
'collections' |
'likes' |
'reviews'
>
export type UserCollectionSummary = Omit<UserCollection,
'user' |
'items'
>
