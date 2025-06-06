import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'
import { requiredEnv } from '@src/common/env-util'
import { ApiError } from '@src/common/error'
import { err, ok, type Result } from 'neverthrow'

export interface CogDataSource {
  client: CognitoIdentityProviderClient
  clientId: string
  userPoolId: string
}

export const getCog = (): Result<CogDataSource, ApiError> => {
  const clientIdRes = requiredEnv('COGNITO_CLIENT_ID')
  const userPoolIdRes = requiredEnv('COGNITO_USER_POOL_ID')

  if (clientIdRes.isErr()) return err(new ApiError('MISSING_ENV', 'COGNITO_CLIENT_ID is missing', 500))
  if (userPoolIdRes.isErr()) return err(new ApiError('MISSING_ENV', 'COGNITO_USER_POOL_ID is missing', 500))

  const client = new CognitoIdentityProviderClient()
  const clientId = clientIdRes.value
  const userPoolId = userPoolIdRes.value

  return ok({ client, clientId, userPoolId })
}
