import { AdminGetUserCommand, type AuthenticationResultType, ConfirmForgotPasswordCommand, ConfirmSignUpCommand, ForgotPasswordCommand, InitiateAuthCommand, ResendConfirmationCodeCommand, SignUpCommand, type SignUpCommandOutput } from '@aws-sdk/client-cognito-identity-provider'
import { ApiError } from '@src/common/error'
import { type ApiDataSources } from '@src/datasources/datasources'
import { err, errAsync, ok, okAsync, type Result, ResultAsync } from 'neverthrow'

const REFR_TOKEN_EXP = 90 * 24 * 60 * 60 // 90 days
const REFR_TOKEN_MAX_AGE = REFR_TOKEN_EXP * 1000
const NOW = (): number => Math.floor(Date.now() / 1000) // Current time in seconds

export interface AuthTokens {
  idToken: string
  accessToken: string
  refreshToken: string
  accExpiresIn: number
  refMaxAge: number
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
      .andThen(result => this.parseTokenPayload(result.AuthenticationResult, old))
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
      .andThen(result => this.parseTokenPayload(result.AuthenticationResult))
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

  confirmSignUp (params: ConfirmSignUpParams): ResultAsync<string, ApiError> {
    const { email, confirmationCode } = params
    const { client, clientId, userPoolId } = this.cog

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
      .andThen(() => ResultAsync
        .fromPromise(
          client.send(
            new AdminGetUserCommand({
              UserPoolId: userPoolId,
              Username: email
            })
          ),
          error => ApiError.fromCognito(error as Error)
        )
      )
      .andThen(payload => {
        const sub = payload.UserAttributes?.find(attr => attr.Name === 'sub')?.Value
        if (sub == null) {
          return errAsync(
            new ApiError(
              'AUTH_ERROR',
              'We were unable to confirm your account. Please try again',
              401,
              'User sub was null'
            )
          )
        }

        return okAsync(sub)
      })
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

  private parseTokenPayload (
    payload: AuthenticationResultType | undefined,
    oldRefresh?: string | undefined
  ): Result<AuthTokens, ApiError> {
    const refresh = oldRefresh ?? payload?.RefreshToken

    if (
      refresh == null ||
      payload?.IdToken == null ||
      payload.AccessToken == null ||
      payload.ExpiresIn == null
    ) {
      return err(
        new ApiError(
          'AUTH_ERROR',
          'Authentication failed',
          401,
          payload
        )
      )
    }

    const { IdToken, AccessToken, ExpiresIn } = payload

    return ok({
      idToken: IdToken,
      accessToken: AccessToken,
      refreshToken: refresh,
      accExpiresIn: NOW() + ExpiresIn,
      refMaxAge: REFR_TOKEN_MAX_AGE
    })
  }
}
