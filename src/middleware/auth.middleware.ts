import { ApiError } from '@src/common/error'
import { type ApiDataSources } from '@src/datasources'
import { type User } from '@src/generated/gql-types'
import { type IncomingMessage } from 'http'
import { type JwtHeader, type JwtPayload, verify } from 'jsonwebtoken'
import { type JwksClient } from 'jwks-rsa'
import { ResultAsync } from 'neverthrow'
import { type Pool } from 'pg'

const getKey = (header: JwtHeader, client: JwksClient): ResultAsync<string, ApiError> => {
  const getKeyPromise = async (): Promise<string> =>
    await new Promise((resolve, reject) => {
      client.getSigningKey(header.kid, (err, key) => {
        if (err != null) {
          reject(new ApiError('AUTH_ERROR', 'ERROR getting signing key', 401, err))
          return
        }

        const pubKey = key?.getPublicKey()
        if (pubKey == null) {
          reject(new ApiError('AUTH_ERROR', 'Public key not found', 401))
          return
        }

        resolve(pubKey)
      })
    })

  return ResultAsync.fromPromise(
    getKeyPromise(),
    (e) => e as ApiError
  )
}

const decodeToken = (token: string, client: JwksClient): ResultAsync<JwtPayload, ApiError> => {
  const verifyPromise = async (): Promise<JwtPayload> =>
    await new Promise((resolve, reject) => {
      verify(
        token,
        (header, callback) => {
          void getKey(header, client)
            .match(
              (key) => { callback(null, key) },
              (err) => { callback(err, undefined) }
            )
        },
        (err, decoded) => {
          if (err != null) {
            reject(new ApiError('AUTH_ERROR', 'Token verification failed', 401, err))
            return
          }

          if (decoded == null) {
            reject(new ApiError('AUTH_ERROR', 'Decoded token is null', 401))
          }

          resolve(decoded as JwtPayload)
        }
      )
    })

  return ResultAsync.fromPromise(
    verifyPromise(),
    (e) => e as ApiError
  )
}

const ME_SQL = /* sql */`
  SELECT
  id,
  email,
  username,
  cognito_id
  FROM USERS
  WHERE cognito_id = $1
`

const getMe = (cognitoId: string, db: Pool): ResultAsync<User | undefined, ApiError> => {
  const getMePromise = async (): Promise<User | undefined> => {
    const { rows } = await db.query<User>(ME_SQL, [cognitoId])
    return rows.at(0)
  }

  return ResultAsync.fromPromise(
    getMePromise(),
    (e) => new ApiError('DB_ERROR', 'Failed to fetch user', 500, e)
  )
}

export const authenticateMe = async (req: IncomingMessage, sources: ApiDataSources): Promise<User | undefined> => {
  const { headers } = req
  const { authorization } = headers
  const token = authorization?.replace('Bearer ', '')
  if (token == null || token.length === 0) return undefined

  const result = await decodeToken(token, sources.jwksClient)
  if (result.isErr()) return undefined

  const cognitoId = result.value.sub
  if (cognitoId == null) return undefined

  const meResult = await getMe(cognitoId, sources.db)
  if (meResult.isErr()) return undefined

  return meResult.value
}
