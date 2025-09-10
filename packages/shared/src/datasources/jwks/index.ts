import { requiredEnv } from '@src/utils/env-util.js'
import { BackendError } from '@src/utils/error.js'
import { JwksClient } from 'jwks-rsa'
import { ok, err, type Result } from 'neverthrow'

export const createJwksClient = (): Result<JwksClient, BackendError> => {
  const jwksUri = requiredEnv('COGNITO_JWKS_URI')

  if (jwksUri.isErr()) {
    return err(new BackendError('MISSING_ENV', 'JWKS_URI is missing', 500))
  }

  const jwksClient = new JwksClient({
    jwksUri: jwksUri.value,
    cache: true,
    cacheMaxEntries: 5,
    cacheMaxAge: 600_000
  })

  return ok(jwksClient)
}
