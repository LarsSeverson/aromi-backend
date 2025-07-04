import { ApiError } from '@src/common/error'
import { type ApiContext } from '@src/context'
import { mapUserRowToUserSummary } from '@src/resolvers/userResolver'
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
  const verifyPromise = async (): Promise<JwtPayload> => {
    let header: JwtHeader

    try {
      const headerSegment = token.split('.')[0]
      const headerJson = Buffer.from(headerSegment, 'base64url').toString('utf8')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      header = JSON.parse(headerJson)
    } catch (err) {
      throw new ApiError('AUTH_ERROR', 'Malformed token header', 401, err)
    }

    const keyResult = await getKey(header, client)
    if (keyResult.isErr()) {
      throw keyResult.error
    }

    return await new Promise((resolve, reject) => {
      verify(token, keyResult.value, (err, decoded) => {
        if (err != null) {
          reject(new ApiError('AUTH_ERROR', 'Token verification failed', 401, err))
          return
        }

        if (decoded == null) {
          reject(new ApiError('AUTH_ERROR', 'Decoded token is null', 401))
          return
        }

        resolve(decoded as JwtPayload)
      })
    })
  }

  return ResultAsync.fromPromise(
    verifyPromise(),
    (e) => e as ApiError
  )
}

export const authenticateMe = async (context: ApiContext): Promise<UserSummary | undefined> => {
  const { req, res, sources, services } = context
  const { user } = services

  const { authorization } = req.headers
  const token = authorization?.replace('Bearer ', '')
  if (token == null || token.length === 0) {
    return undefined
  }

  const result = await decodeToken(token, sources.jwksClient)
  if (result.isErr()) {
    return undefined
  }

  const cognitoId = result.value.sub
  if (cognitoId == null) return undefined

  const oldRefresh = req.cookies.refreshToken as (string | undefined)

  return await user
    .findOne(eb => eb('users.cognitoId', '=', cognitoId))
    .mapErr(error => {
      console.log(error)
      if (oldRefresh != null) {
        res.clearCookie('refreshToken', {
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        })
      }
    })
    .match(
      row => mapUserRowToUserSummary(row),
      _ => undefined
    )
}
