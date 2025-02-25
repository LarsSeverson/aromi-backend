import { Fragrance, FragranceCollection } from './fragranceTypes'

export interface User {
  id: number
  username: string
  email: string
  cognitoId: string

  followers: number
  following: number

  collections: FragranceCollection[]
}
