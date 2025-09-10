import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'
import { requiredEnv } from '@src/utils/env-util.js'
import type { BackendError } from '@src/utils/error.js'
import { Result } from 'neverthrow'

export interface CognitoWrapper {
  client: CognitoIdentityProviderClient
  clientId: string
  userPoolId: string
}

export const createCognitoWrapper = (): Result<CognitoWrapper, BackendError> => {
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
