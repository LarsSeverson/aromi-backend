import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'
import { requiredEnv } from '@src/common/env-util'
import { type ApiError } from '@src/common/error'
import { Result } from 'neverthrow'

export interface CognitoWrapper {
  client: CognitoIdentityProviderClient
  clientId: string
  userPoolId: string
}

export const createCognitoWrapper = (): Result<CognitoWrapper, ApiError> => {
  return Result
    .combine(
      [
        requiredEnv('COGNITO_CLIENT_ID'),
        requiredEnv('COGNITO_USER_POOL_ID')
      ]
    )
    .map(([clientId, userPoolId]) => {
      const client = new CognitoIdentityProviderClient()
      return {
        client,
        clientId,
        userPoolId
      }
    })
}
