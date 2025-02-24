import { Fragrance } from './fragranceTypes'

export interface User {
  id: number
  username: string
  email: string
  cognitoId: string

  followers: number
  following: number
}

export interface UserCollection {
  id: number
  name: number
  fragrances: Fragrance[]
}
