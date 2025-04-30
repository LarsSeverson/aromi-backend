import { InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider'
import { ApiError, mapCognitoError } from '@src/common/error'
import { type ApiDataSources } from '@src/datasources'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'

export interface AuthTokens {
  idToken: string
  accessToken: string
  refreshToken?: string
  expiresIn: number
}

export interface LogInParams {
  email: string
  password: string
}

export interface RefreshParams {
  old: string
}

export class AuthService {
  cog: ApiDataSources['cog']

  constructor (cog: ApiDataSources['cog']) {
    this.cog = cog
  }

  logIn (params: LogInParams): ResultAsync<AuthTokens, ApiError> {
    const { email, password } = params
    const { client, clientId } = this.cog

    return ResultAsync.fromPromise(
      client.send(
        new InitiateAuthCommand({
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: clientId,
          AuthParameters: { USERNAME: email, PASSWORD: password }
        })
      ),
      error => mapCognitoError(error as Error)
    )
      .andThen(result => {
        const auth = result.AuthenticationResult
        if (
          auth?.IdToken == null ||
          auth.AccessToken == null ||
          auth.RefreshToken == null ||
          auth.ExpiresIn == null
        ) return errAsync(new ApiError('AUTH_ERROR', 'Authentication failed', 401, result))

        const authTokens: AuthTokens = {
          idToken: auth.IdToken,
          accessToken: auth.AccessToken,
          refreshToken: auth.RefreshToken,
          expiresIn: auth.ExpiresIn
        }

        return okAsync(authTokens)
      })
  }

  refresh (params: RefreshParams): ResultAsync<AuthTokens, ApiError> {
    const { old } = params
    const { cog } = this
    const { client, clientId } = cog

    return ResultAsync.fromPromise(
      client.send(
        new InitiateAuthCommand({
          AuthFlow: 'REFRESH_TOKEN_AUTH',
          ClientId: clientId,
          AuthParameters: { REFRESH_TOKEN: old }
        })
      ),
      error => mapCognitoError(error as Error)
    )
      .andThen(result => {
        const auth = result.AuthenticationResult
        if (
          auth?.IdToken == null ||
          auth.AccessToken == null ||
          auth.ExpiresIn == null
        ) return errAsync(new ApiError('AUTH_ERROR', 'Authentication failed', 401, result))

        const authTokens: AuthTokens = {
          idToken: auth.IdToken,
          accessToken: auth.AccessToken,
          refreshToken: auth.RefreshToken,
          expiresIn: auth.ExpiresIn
        }

        return okAsync(authTokens)
      })
  }
}
