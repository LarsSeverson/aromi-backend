import { ApiError } from '@src/common/error'
import { type ApiContext } from '@src/context'
import { type UserSummary } from '@src/schemas/user/mappers'
import { type JwtHeader, type JwtPayload, verify } from 'jsonwebtoken'
import { type JwksClient } from 'jwks-rsa'
import { ResultAsync } from 'neverthrow'

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

export const authenticateMe = async (context: ApiContext): Promise<UserSummary | undefined> => {
  const { req, sources, services } = context
  const { user } = services

  const { authorization } = req.headers
  const token = authorization?.replace('Bearer ', '')
  if (token == null || token.length === 0) return undefined

  const result = await decodeToken(token, sources.jwksClient)
  if (result.isErr()) return undefined

  const cognitoId = result.value.sub
  if (cognitoId == null) return undefined

  return await user
    .getByCognitoId(cognitoId)
    .unwrapOr(undefined)
}
