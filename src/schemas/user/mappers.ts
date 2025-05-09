import { type User } from '@src/generated/gql-types'

export type UserSummary = Omit<User,
'collections' |
'likes' |
'reviews'
>
