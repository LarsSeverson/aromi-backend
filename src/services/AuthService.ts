import { AdminGetUserCommand, type AuthenticationResultType, type CodeDeliveryDetailsType, ConfirmForgotPasswordCommand, type ConfirmForgotPasswordCommandOutput, ConfirmSignUpCommand, ForgotPasswordCommand, InitiateAuthCommand, ResendConfirmationCodeCommand, RevokeTokenCommand, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider'
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

export interface DeliveryResult {
  isComplete?: boolean | undefined
  attribute?: string | undefined
  destination?: string | undefined
  method?: string | undefined
}

export class AuthService {
  cog: ApiDataSources['cog']

  constructor (sources: ApiDataSources) {
    this.cog = sources.cog
  }

  refresh (
    old: string
  ): ResultAsync<AuthTokens, ApiError> {
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

  logIn (
    email: string,
    password: string
  ): ResultAsync<AuthTokens, ApiError> {
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

  logOut (
    refreshToken: string
  ): ResultAsync<void, ApiError> {
    const { client, clientId } = this.cog

    return ResultAsync
      .fromPromise(
        client.send(
          new RevokeTokenCommand({
            ClientId: clientId,
            Token: refreshToken
          })
        ),
        error => new ApiError('AUTH_ERROR', 'Authentication failed', 401, error)
      )
      .map(() => undefined)
  }

  signUp (
    email: string,
    password: string
  ): ResultAsync<DeliveryResult, ApiError> {
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
      .map(cogOutput => {
        const { UserConfirmed, CodeDeliveryDetails } = cogOutput
        const confirmed = UserConfirmed ?? false
        const delivery = this.getDeliveryDetails(CodeDeliveryDetails)

        return {
          isComplete: confirmed,
          ...delivery
        }
      })
  }

  confirmSignUp (
    email: string,
    confirmationCode: string
  ): ResultAsync<string, ApiError> {
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

  forgotPassword (
    email: string
  ): ResultAsync<DeliveryResult, ApiError> {
    const username = email
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
      .map(cogOutput => this.getDeliveryDetails(cogOutput.CodeDeliveryDetails) ?? {})
  }

  confirmForgotPassword (
    email: string,
    confirmationCode: string,
    newPassword: string
  ): ResultAsync<ConfirmForgotPasswordCommandOutput, ApiError> {
    const username = email
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
  }

  resendSignUpConfirmationCode (
    email: string
  ): ResultAsync<DeliveryResult, ApiError> {
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
      .map(cogOutput => {
        const { CodeDeliveryDetails } = cogOutput
        const delivery = this.getDeliveryDetails(CodeDeliveryDetails)

        return {
          isComplete: true,
          ...delivery
        }
      })
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

  private getDeliveryDetails (
    cogOutput: CodeDeliveryDetailsType | undefined
  ): Omit<DeliveryResult, 'isComplete'> | undefined {
    const delivery = cogOutput != null
      ? {
          attribute: cogOutput.AttributeName,
          destination: cogOutput.Destination,
          method: cogOutput.DeliveryMedium
        }
      : undefined

    return delivery
  }
}
