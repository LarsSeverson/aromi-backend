import { requiredEnv } from '@src/common/env-util'
import { ApiError } from '@src/common/error'
import { JwksClient } from 'jwks-rsa'
import { ok, err, type Result } from 'neverthrow'

export const getJwksClient = (): Result<JwksClient, ApiError> => {
  const jwksUri = requiredEnv('JWKS_URI')

  if (jwksUri.isErr()) {
    return err(
      new ApiError(
        'MISSING_ENV',
        'JWKS_URI is missing',
        500
      )
    )
  }

  const jwksClient = new JwksClient({
    jwksUri: jwksUri.value,
    cache: true,
    cacheMaxEntries: 5,
    cacheMaxAge: 600_000
  })

  return ok(jwksClient)
}
