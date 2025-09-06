import { parseSchema } from '@src/utils/validation'
import { ConfirmForgotPasswordSchema, ConfirmSignUpSchema, ForgotPasswordSchema, LogInSchema, ResendSignUpCodeSchema, SignUpSchema } from '../utils/validation'
import { ApiError, throwError } from '@src/utils/error'
import { IS_APP_PRODUCTION } from '@src/utils/constants'
import { type Response } from 'express'
import { BaseResolver } from '@src/server/resolvers/BaseResolver'
import { generateFromEmail } from 'unique-username-generator'
import { type AuthDeliveryResult, type AuthTokenPayload, type MutationResolvers } from '@generated/gql-types'
import { type RawAuthTokenPayload, REFRESH_TOKEN_COOKIE, REFRESH_TOKEN_PATH, type AuthDeliveryResultSummary } from '@src/features/auth'

export class AuthMutationResolvers extends BaseResolver<MutationResolvers> {
  refresh: MutationResolvers['refresh'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { req, res, services } = context
    const { auth } = services

    const oldRefreshToken = req.cookies.refreshToken as (string | undefined)
    if (oldRefreshToken == null) return null

    return await auth
      .refresh(oldRefreshToken)
      .match(
        payload => this.processRawAuthTokenPayload(payload, res),
        () => null
      )
  }

  logIn: MutationResolvers['logIn'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args

    parseSchema(LogInSchema, input)

    const { res, services } = context
    const { auth } = services

    return await auth
      .logIn(input)
      .match(
        payload => this.processRawAuthTokenPayload(payload, res),
        throwError
      )
  }

  logOut: MutationResolvers['logOut'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { req, res, services } = context
    const { auth } = services

    const refreshToken = req.cookies.refreshToken as (string | undefined)

    if (refreshToken == null) {
      throw new ApiError(
        'NOT_AUTHORIZED',
        'You need to log in or sign up before logging out',
        401
      )
    }

    return await auth
      .logOut(refreshToken)
      .match(
        () => {
          this.clearRefreshCookie(res)
          return true
        },
        throwError
      )
  }

  signUp: MutationResolvers['signUp'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args

    parseSchema(SignUpSchema, input)

    const { services } = context
    const { auth } = services

    return await auth
      .signUp(input)
      .match(
        result => this.processAuthDeliveryResult(result),
        throwError
      )
  }

  confirmSignUp: MutationResolvers['confirmSignUp'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args

    parseSchema(ConfirmSignUpSchema, input)

    const { email } = input
    const { services } = context
    const { auth, users } = services

    const username = generateFromEmail(email)

    return await auth
      .confirmSignUp(input)
      .andThen(({ sub }) => users
        .create({ email, username, cognitoSub: sub })
      )
      .match(
        () => true,
        throwError
      )
  }

  resendSignUpCode: MutationResolvers['resendSignUpCode'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args

    parseSchema(ResendSignUpCodeSchema, input)

    const { services } = context
    const { auth } = services

    return await auth
      .resendSignUpCode(input)
      .match(
        result => this.processAuthDeliveryResult(result),
        throwError
      )
  }

  forgotPassword: MutationResolvers['forgotPassword'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args

    parseSchema(ForgotPasswordSchema, input)

    const { services } = context
    const { auth } = services

    return await auth
      .forgotPassword(input)
      .match(
        result => this.processAuthDeliveryResult(result),
        throwError
      )
  }

  confirmForgotPassword: MutationResolvers['confirmForgotPassword'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args

    parseSchema(ConfirmForgotPasswordSchema, input)

    const { services } = context
    const { auth } = services

    return await auth
      .confirmForgotPassword(input)
      .match(
        () => true,
        throwError
      )
  }

  getResolvers (): MutationResolvers {
    return {
      refresh: this.refresh,

      logIn: this.logIn,
      logOut: this.logOut,

      signUp: this.signUp,
      confirmSignUp: this.confirmSignUp,
      resendSignUpCode: this.resendSignUpCode,

      forgotPassword: this.forgotPassword,
      confirmForgotPassword: this.confirmForgotPassword
    }
  }

  private processRawAuthTokenPayload (
    payload: RawAuthTokenPayload,
    res: Response
  ): AuthTokenPayload {
    const {
      refreshToken,
      accessToken,
      idToken,

      accessTokenExpiresIn,
      refreshTokenMaxAge
    } = payload

    this.signRefreshCookie(refreshToken, refreshTokenMaxAge, res)

    return {
      accessToken,
      idToken,
      expiresIn: accessTokenExpiresIn
    }
  }

  private clearRefreshCookie (
    res: Response
  ): void {
    res.clearCookie(
      REFRESH_TOKEN_COOKIE,
      {
        path: REFRESH_TOKEN_PATH,
        secure: IS_APP_PRODUCTION,
        sameSite: 'lax'
      }
    )
  }

  private signRefreshCookie (
    token: string,
    maxAge: number,
    res: Response
  ): void {
    res.cookie(
      REFRESH_TOKEN_COOKIE,
      token,
      {
        httpOnly: true,
        secure: IS_APP_PRODUCTION,
        path: REFRESH_TOKEN_PATH,
        sameSite: 'lax',
        maxAge
      }
    )
  }

  private processAuthDeliveryResult (
    result: AuthDeliveryResultSummary
  ): AuthDeliveryResult {
    const { isComplete, ...rest } = result

    return {
      isComplete: isComplete ?? false,
      delivery: {
        ...rest
      }
    }
  }
}
