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
import { createFragranceReviewLoader, type FragranceReviewKey } from './loaders/fragrance-review-loader'
import { createReviewUserLoader, type ReviewUserKey } from './loaders/review-user-loader'

export interface ContextLoaders {
  fragranceImages: DataLoader<FragranceImageKey, FragranceImage[]>
  fragranceReviews: DataLoader<FragranceReviewKey, FragranceReview[]>
  userReviews: DataLoader<UserReviewKey, FragranceReview[]>
  reviewFragrance: DataLoader<ReviewFragranceKey, Fragrance>
  reviewUser: DataLoader<ReviewUserKey, User>
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

export const getContext = async ({ event }: { event: APIGatewayProxyEventV2, context: LambdaContext }): Promise<Context> => {
  const { headers } = event
  const { authorization } = headers
  const token = authorization?.replace('Bearer ', '') ?? undefined

  const ctx: Context = {
    pool: aromidb,
    token,
    dataLoaders: {
      fragranceImages: createFragranceImagesLoader(aromidb),
      fragranceReviews: createFragranceReviewLoader(aromidb),
      userReviews: createUserReviewsLoader(aromidb),
      reviewFragrance: createReviewFragranceLoader(aromidb),
      reviewUser: createReviewUserLoader(aromidb)
    }
  }

  const decoded = await decodeToken(token)
  const cognitoId = decoded?.sub ?? undefined

  if (cognitoId !== undefined) {
    ctx.user = await getCurrentUser(cognitoId, aromidb) ?? undefined
  }

  return ctx
}
