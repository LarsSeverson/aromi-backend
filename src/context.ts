import type { Pool } from 'pg'
import aromidb from './datasources'
import { type JwtHeader, type JwtPayload, type SigningKeyCallback, verify } from 'jsonwebtoken'
import { JwksClient } from 'jwks-rsa'
import { requiredEnv } from './common/env-util'
import { type Fragrance, type FragranceImage, type FragranceReview, type User } from './generated/gql-types'
import { type APIGatewayProxyEventV2, type Context as LambdaContext } from 'aws-lambda'
import type DataLoader from 'dataloader'
import { createUserReviewsLoader, type UserReviewKey } from './loaders/user-reviews-loader'
import { createFragranceImagesLoader, type FragranceImageKey } from './loaders/fragrance-images-loader'
import { createReviewFragranceLoader, type ReviewFragranceKey } from './loaders/review-fragrance-loader'
import { createFragranceReviewsLoader, type FragranceReviewKey } from './loaders/fragrance-review-loader'
import { createReviewUserLoader, type ReviewUserKey } from './loaders/review-user-loader'
import { createCollectionUserLoader, type CollectionUserKey } from './loaders/collection-user-loader'

export interface ContextLoaders {
  fragranceImages: DataLoader<FragranceImageKey, FragranceImage[]>
  fragranceReviews: DataLoader<FragranceReviewKey, FragranceReview[]>
  userReviews: DataLoader<UserReviewKey, FragranceReview[]>
  reviewFragrance: DataLoader<ReviewFragranceKey, Fragrance>
  reviewUser: DataLoader<ReviewUserKey, User>
  collectionUser: DataLoader<CollectionUserKey, User>
}

export interface Context {
  pool: Pool
  token?: string | undefined
  user?: User | undefined

  dataLoaders: ContextLoaders
}

const client = new JwksClient({
  jwksUri: requiredEnv('USER_POOL_JWKS'),
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 600000
})

const getKey = (header: JwtHeader, callback: SigningKeyCallback): void => {
  client.getSigningKey(header.kid, (err, key) => {
    callback(err, key?.getPublicKey())
  })
}

const decodeToken = async (token: string | undefined): Promise<JwtPayload | null> => {
  if (token == null || token.length === 0) return null

  try {
    const decoded = await new Promise<JwtPayload>((resolve, reject) => {
      verify(
        token,
        getKey,
        (err, decoded) => {
          if (err !== null) reject(err)
          if (decoded === undefined) reject(new Error('Decode undefined'))
          else resolve(decoded as JwtPayload)
        }
      )
    })

    return decoded
  } catch (error) {
    console.log(error)

    return null
  }
}

const getCurrentUser = async (cognitoId: string, pool: Pool): Promise<User | null> => {
  const query = /* sql */`
    SELECT
      id,
      email,
      username,
      cognito_id AS "cognitoId"
      FROM users
      WHERE cognito_id = $1
  `
  const values = [cognitoId]
  const { rows } = await pool.query<User>(query, values)

  return rows.at(0) ?? null
}

const createContext = (pool: Pool, token: string | undefined): Context => {
  const cache: Partial<ContextLoaders> = {}

  const dataLoaders: ContextLoaders = {
    get fragranceImages () {
      if (cache.fragranceImages == null) {
        cache.fragranceImages = createFragranceImagesLoader(pool)
      }

      return cache.fragranceImages
    },
    get fragranceReviews () {
      if (cache.fragranceReviews == null) {
        cache.fragranceReviews = createFragranceReviewsLoader(pool)
      }

      return cache.fragranceReviews
    },
    get userReviews () {
      if (cache.userReviews == null) {
        cache.userReviews = createUserReviewsLoader(pool)
      }

      return cache.userReviews
    },
    get reviewFragrance () {
      if (cache.reviewFragrance == null) {
        cache.reviewFragrance = createReviewFragranceLoader(pool)
      }

      return cache.reviewFragrance
    },
    get reviewUser () {
      if (cache.reviewUser == null) {
        cache.reviewUser = createReviewUserLoader(pool)
      }

      return cache.reviewUser
    },
    get collectionUser () {
      if (cache.collectionUser == null) {
        cache.collectionUser = createCollectionUserLoader(pool)
      }

      return cache.collectionUser
    }
  }

  return {
    pool,
    token,
    dataLoaders
  }
}

export const getContext = async ({ event }: { event: APIGatewayProxyEventV2, context: LambdaContext }): Promise<Context> => {
  const { headers } = event
  const { authorization } = headers
  const token = authorization?.replace('Bearer ', '') ?? undefined

  const context = createContext(aromidb, token)

  const decoded = await decodeToken(token)
  const cognitoId = decoded?.sub ?? undefined

  if (cognitoId !== undefined) {
    context.user = await getCurrentUser(cognitoId, aromidb) ?? undefined
  }

  return context
}
