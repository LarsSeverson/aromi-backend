import { ApiService } from '@src/server/services/ApiService'
import { decodeToken } from '../../../../datasources/jwks/token'
import { err, errAsync, ok, okAsync, type Result, ResultAsync } from 'neverthrow'
import { ApiError } from '@src/common/error'
import { UserService } from '@src/server/features/users/services/UserService'
import { type DataSources } from '@src/datasources'
import { type JwtPayload } from 'jsonwebtoken'
import { type UserRow } from '@src/server/features/users/types'
import { AdminGetUserCommand, type AdminGetUserCommandOutput, type AuthenticationResultType, type CodeDeliveryDetailsType, ConfirmForgotPasswordCommand, ConfirmSignUpCommand, ForgotPasswordCommand, InitiateAuthCommand, ResendConfirmationCodeCommand, RevokeTokenCommand, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider'
import { type AuthDeliveryResultSummary, type RawAuthTokenPayload } from '../types'
import { NOW } from '@src/common/constants'
import { REFRESH_TOKEN_MAX_AGE } from '../constants'
import { type SignUpInput, type LogInInput, type ConfirmSignUpInput, type ForgotPasswordInput, type ConfirmForgotPasswordInput, type ResendSignUpCodeInput } from '@src/generated/gql-types'

export class AuthService extends ApiService {
  cognito: DataSources['cognito']
  users: UserService

  constructor (sources: DataSources) {
    super(sources)

    this.cognito = sources.cognito
    this.users = new UserService(sources)
  }

  authenticateMe (
    token?: string
  ): ResultAsync<UserRow, ApiError> {
    return this
      .parseToken(token)
      .andThen(({ sub }) => {
        if (sub == null) {
          return errAsync(
            new ApiError(
              'NOT_AUTHENTICATED',
              'You are not authenticated. Please log in or sign up',
              401
            )
          )
        }

        return okAsync(sub)
      })
      .andThen((sub) => this
        .users
        .findOne(
          eb => eb('users.cognitoSub', '=', sub)
        )
      )
  }

  refresh (
    oldToken: string
  ): ResultAsync<RawAuthTokenPayload, ApiError> {
    const { client, clientId } = this.cognito

    return ResultAsync
      .fromPromise(
        client
          .send(
            new InitiateAuthCommand({
              AuthFlow: 'REFRESH_TOKEN_AUTH',
              ClientId: clientId,
              AuthParameters: { REFRESH_TOKEN: oldToken }
            })
          ),
        error => ApiError.fromCognito(error)
      )
      .andThen(cognitoPayload => this
        .parseTokenPayload(cognitoPayload.AuthenticationResult, oldToken)
      )
  }

  logIn (
    input: LogInInput
  ): ResultAsync<RawAuthTokenPayload, ApiError> {
    const { client, clientId } = this.cognito
    const { email, password } = input

    return ResultAsync
      .fromPromise(
        client
          .send(
            new InitiateAuthCommand({
              AuthFlow: 'USER_PASSWORD_AUTH',
              ClientId: clientId,
              AuthParameters: {
                USERNAME: email,
                PASSWORD: password
              }
            })
          ),
        error => ApiError.fromCognito(error)
      )
      .orTee(error => {
        if (error.code === 'NOT_CONFIRMED') {
          void this.resendSignUpCode(input)
        }
      })
      .andThen(cognitoPayload => this
        .parseTokenPayload(cognitoPayload.AuthenticationResult)
      )
  }

  logOut (
    refreshToken: string
  ): ResultAsync<boolean, ApiError> {
    const { client, clientId } = this.cognito

    return ResultAsync
      .fromPromise(
        client
          .send(
            new RevokeTokenCommand({
              ClientId: clientId,
              Token: refreshToken
            })
          ),
        error => ApiError.fromCognito(error)
      )
      .map(() => true)
  }

  signUp (
    input: SignUpInput
  ): ResultAsync<AuthDeliveryResultSummary, ApiError> {
    const { client, clientId } = this.cognito
    const { email, password } = input

    return ResultAsync
      .fromPromise(
        client
          .send(
            new SignUpCommand({
              ClientId: clientId,
              Username: email,
              Password: password,
              UserAttributes: [{
                Name: 'email',
                Value: email
              }]
            })
          ),
        error => ApiError.fromCognito(error)
      )
      .map(cognitoPayload => this
        .parseDeliveryPayload(cognitoPayload?.CodeDeliveryDetails, cognitoPayload?.UserConfirmed)
      )
  }

  confirmSignUp (
    input: ConfirmSignUpInput
  ): ResultAsync<{ sub: string }, ApiError> {
    const { client, clientId } = this.cognito
    const { email, code } = input

    return ResultAsync
      .fromPromise(
        client
          .send(
            new ConfirmSignUpCommand({
              ClientId: clientId,
              Username: email,
              ConfirmationCode: code
            })
          ),
        error => ApiError.fromCognito(error)
      )
      .andThen(() => this
        .getCogUser(email)
      )
      .andThen(cognitoPayload => this
        .getCogUserSub(cognitoPayload)
      )
      .map(sub => ({ sub }))
  }

  resendSignUpCode (
    input: ResendSignUpCodeInput
  ): ResultAsync<AuthDeliveryResultSummary, ApiError> {
    const { client, clientId } = this.cognito
    const { email } = input

    return ResultAsync
      .fromPromise(
        client
          .send(
            new ResendConfirmationCodeCommand({
              ClientId: clientId,
              Username: email
            })
          ),
        error => ApiError.fromCognito(error)
      )
      .map(cognitoPayload => this
        .parseDeliveryPayload(cognitoPayload.CodeDeliveryDetails)
      )
  }

  forgotPassword (
    input: ForgotPasswordInput
  ): ResultAsync<AuthDeliveryResultSummary, ApiError> {
    const { client, clientId } = this.cognito
    const { email } = input

    return ResultAsync
      .fromPromise(
        client
          .send(
            new ForgotPasswordCommand({
              ClientId: clientId,
              Username: email
            })
          ),
        error => ApiError.fromCognito(error)
      )
      .map(cognitoPayload => this
        .parseDeliveryPayload(cognitoPayload.CodeDeliveryDetails)
      )
  }

  confirmForgotPassword (
    input: ConfirmForgotPasswordInput
  ): ResultAsync<boolean, ApiError> {
    const { client, clientId } = this.cognito
    const { email, code, password } = input

    return ResultAsync
      .fromPromise(
        client
          .send(
            new ConfirmForgotPasswordCommand({
              ClientId: clientId,
              Username: email,
              ConfirmationCode: code,
              Password: password
            })
          ),
        error => ApiError.fromCognito(error)
      )
      .map(() => true)
  }

  private getCogUser (
    email: string
  ): ResultAsync<AdminGetUserCommandOutput, ApiError> {
    const { client, userPoolId } = this.cognito

    return ResultAsync
      .fromPromise(
        client
          .send(
            new AdminGetUserCommand({
              UserPoolId: userPoolId,
              Username: email
            })
          ),
        error => ApiError.fromCognito(error)
      )
  }

  private getCogUserSub (
    input: AdminGetUserCommandOutput
  ): Result<string, ApiError> {
    const sub = input
      .UserAttributes?.find(attr => attr.Name === 'sub')?.Value

    if (sub == null) {
      return err(
        new ApiError(
          'NOT_AUTHENTICATED',
          'We were unable to confirm you account. Please try again',
          401,
          'User sub was null'
        )
      )
    }

    return ok(sub)
  }

  private parseToken (
    token?: string
  ): ResultAsync<JwtPayload, ApiError> {
    if (token == null || token.length === 0) {
      return errAsync(
        new ApiError(
          'INVALID_TOKEN',
          'This auth token is invalid. Try again',
          401
        )
      )
    }

    return decodeToken(token, this.sources.jwks)
      .andThen(result => {
        if (result == null) {
          return errAsync(
            new ApiError(
              'INVALID_TOKEN',
              'This auth token is invalid. Try again',
              401
            )
          )
        }

        return okAsync(result)
      })
  }

  private parseTokenPayload (
    payload: AuthenticationResultType | undefined,
    oldRefreshToken?: string | undefined
  ): Result<RawAuthTokenPayload, ApiError> {
    const refreshToken = oldRefreshToken ?? payload?.RefreshToken
    const {
      IdToken: idToken,
      AccessToken: accessToken,
      ExpiresIn: expiresIn
    } = payload ?? {}

    if (refreshToken == null || idToken == null || accessToken == null || expiresIn == null) {
      return err(
        new ApiError(
          'NOT_AUTHENTICATED',
          'You are not authenticated. Please log in or sign up',
          401,
          payload
        )
      )
    }

    return ok({
      refreshToken,
      accessToken,
      idToken,

      accessTokenExpiresIn: NOW() + expiresIn,
      refreshTokenMaxAge: REFRESH_TOKEN_MAX_AGE
    })
  }

  private parseDeliveryPayload (
    deliveryDetails: CodeDeliveryDetailsType | undefined,
    isUserConfirmed?: boolean | undefined
  ): AuthDeliveryResultSummary {
    const {
      AttributeName: attribute,
      Destination: destination,
      DeliveryMedium: method
    } = deliveryDetails ?? {}

    return {
      isComplete: isUserConfirmed,

      attribute,
      destination,
      method
    }
  }
}
