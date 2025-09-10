import { BackendError } from '@src/utils/error.js'
import json, { type JwtPayload, type JwtHeader } from 'jsonwebtoken'
import type { JwksClient } from 'jwks-rsa'
import { ResultAsync } from 'neverthrow'

const { verify } = json

const getKey = (
  header: JwtHeader,
  client: JwksClient
): ResultAsync<string, BackendError> => {
  const getKeyPromise = async (): Promise<string> =>
    await new Promise((resolve, reject) => {
      client.getSigningKey(header.kid, (err, key) => {
        if (err != null) {
          reject(new BackendError('AUTH_ERROR', 'ERROR getting signing key', 401, err))
          return
        }

        const pubKey = key?.getPublicKey()
        if (pubKey == null) {
          reject(new BackendError('AUTH_ERROR', 'Public key not found', 401))
          return
        }

        resolve(pubKey)
      })
    })

  return ResultAsync
    .fromPromise(
      getKeyPromise(),
      (e) => e as BackendError
    )
}

export const decodeToken = (
  token: string,
  client: JwksClient
): ResultAsync<JwtPayload, BackendError> => {
  const verifyPromise = async (): Promise<JwtPayload> => {
    let header: JwtHeader

    try {
      const headerSegment = token.split('.')[0]
      const headerJson = Buffer.from(headerSegment, 'base64url').toString('utf8')
      header = JSON.parse(headerJson) as JwtHeader
    } catch (err) {
      throw new BackendError('AUTH_ERROR', 'Malformed token header', 401, err)
    }

    const keyResult = await getKey(header, client)
    if (keyResult.isErr()) {
      throw keyResult.error
    }

    return await new Promise((resolve, reject) => {
      verify(token, keyResult.value, (err, decoded) => {
        if (err != null) {
          reject(new BackendError('AUTH_ERROR', 'Token verification failed', 401, err))
          return
        }

        if (decoded == null) {
          reject(new BackendError('AUTH_ERROR', 'Decoded token is null', 401))
          return
        }

        resolve(decoded as JwtPayload)
      })
    })
  }

  return ResultAsync.fromPromise(
    verifyPromise(),
    (e) => e as BackendError
  )
}
