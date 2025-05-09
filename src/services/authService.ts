import { ConfirmForgotPasswordCommand, ConfirmSignUpCommand, ForgotPasswordCommand, InitiateAuthCommand, ResendConfirmationCodeCommand, SignUpCommand, type SignUpCommandOutput } from '@aws-sdk/client-cognito-identity-provider'
import { ApiError } from '@src/common/error'
import { type ApiDataSources } from '@src/datasources/datasources'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'

export interface AuthTokens {
  idToken: string
  accessToken: string
  refreshToken?: string
  expiresIn: number
}

export interface RefreshParams {
  old: string
}

export interface LogInParams {
  email: string
  password: string
}

export interface SignUpParams {
  email: string
  password: string
}

export interface ConfirmSignUpParams {
  email: string
  confirmationCode: string
}

export interface ForgotPasswordParams {
  email: string
}

export interface ConfirmForgotPasswordParams {
  email: string
  confirmationCode: string
  newPassword: string
}

export class AuthService {
  cog: ApiDataSources['cog']

  constructor (sources: ApiDataSources) {
    this.cog = sources.cog
  }

  refresh (params: RefreshParams): ResultAsync<AuthTokens, ApiError> {
    const { old } = params
    const { cog } = this
    const { client, clientId } = cog

    return ResultAsync
      .fromPromise(
        client.send(
          new InitiateAuthCommand({
            AuthFlow: 'REFRESH_TOKEN_AUTH',
            ClientId: clientId,
            AuthParameters: { REFRESH_TOKEN: old }
          })
        ),
        error => ApiError.fromCognito(error as Error)
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

  logIn (params: LogInParams): ResultAsync<AuthTokens, ApiError> {
    const { email, password } = params
    const { client, clientId } = this.cog

    return ResultAsync
      .fromPromise(
        client.send(
          new InitiateAuthCommand({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: clientId,
            AuthParameters: { USERNAME: email, PASSWORD: password }
          })
        ),
        error => ApiError.fromCognito(error as Error)
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

  logOut (): ResultAsync<void, ApiError> {
    // Placeholder
    return ResultAsync
      .fromPromise(
        Promise.resolve(),
        error => new ApiError('AUTH_ERROR', 'Authentication failed', 401, error)
      )
      .map(() => undefined)
  }

  signUp (params: SignUpParams): ResultAsync<SignUpCommandOutput, ApiError> {
    const { email, password } = params
    const { client, clientId } = this.cog

    return ResultAsync
      .fromPromise(
        client.send(
          new SignUpCommand({
            ClientId: clientId,
            Username: email,
            Password: password,
            UserAttributes: [
              {
                Name: 'email',
                Value: email
              }
            ]
          })
        ),
        error => ApiError.fromCognito(error as Error)
      )
  }

  confirmSignUp (params: ConfirmSignUpParams): ResultAsync<void, ApiError> {
    const { email, confirmationCode } = params
    const { client, clientId } = this.cog

    return ResultAsync
      .fromPromise(
        client.send(
          new ConfirmSignUpCommand({
            ClientId: clientId,
            Username: email,
            ConfirmationCode: confirmationCode
          })
        ),
        error => ApiError.fromCognito(error as Error)
      )
      .map(() => undefined)
  }

  forgotPassword (params: ForgotPasswordParams): ResultAsync<void, ApiError> {
    const { email: username } = params
    const { client, clientId } = this.cog

    return ResultAsync
      .fromPromise(
        client.send(
          new ForgotPasswordCommand({
            ClientId: clientId,
            Username: username
          })
        ),
        error => ApiError.fromCognito(error as Error)
      )
      .map(() => undefined)
  }

  confirmForgotPassword (params: ConfirmForgotPasswordParams): ResultAsync<void, ApiError> {
    const { email: username, confirmationCode, newPassword } = params
    const { client, clientId } = this.cog

    return ResultAsync
      .fromPromise(
        client.send(
          new ConfirmForgotPasswordCommand({
            ClientId: clientId,
            Username: username,
            ConfirmationCode: confirmationCode,
            Password: newPassword
          })
        ),
        error => ApiError.fromCognito(error as Error)
      )
      .map(() => undefined)
  }

  resendSignUpConfirmationCode (params: { email: string }): ResultAsync<void, ApiError> {
    const { email } = params
    const { client, clientId } = this.cog

    return ResultAsync
      .fromPromise(
        client.send(
          new ResendConfirmationCodeCommand({
            ClientId: clientId,
            Username: email
          })
        ),
        error => ApiError.fromCognito(error as Error)
      )
      .map(() => undefined)
  }
}
