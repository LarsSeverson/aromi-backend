import { ApolloError } from '@apollo/client'
import { type User } from '@src/generated/gql-types'
import DataLoader from 'dataloader'
import { type Pool } from 'pg'

const BASE_QUERY = /* sql */`
  SELECT
    fc.id AS "collectionId",
    u.id
    u.username,
    u.email,
    u.cognito_id AS "cognitoId",
    0 AS followers,
    0 AS following
  FROM fragrance_collections fc
  JOIN users u ON u.id = fc.user_id
  WHERE fc.id = ANY($1)
`

export interface CollectionUserKey {
  collectionId: number
}

export const createCollectionUserLoader = (pool: Pool): DataLoader<CollectionUserKey, User> =>
  new DataLoader<CollectionUserKey, User>(async (keys) => {
    const collectionIds = keys.map(key => key.collectionId)
    const values = [collectionIds]

    const { rows } = await pool.query<User & { collectionId: number }>(BASE_QUERY, values)

    const users = collectionIds.map(id => {
      const user = rows.find(row => row.collectionId === id)
      if (user == null) throw new ApolloError({ errorMessage: 'User not found' })

      return user
    })

    return users
  })
