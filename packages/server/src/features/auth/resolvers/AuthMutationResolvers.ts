import { ConfirmForgotPasswordSchema, ConfirmSignUpSchema, ForgotPasswordSchema, LogInSchema, ResendSignUpCodeSchema, SignUpSchema } from '../utils/validation.js'
import type { Response } from 'express'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { generateFromEmail } from 'unique-username-generator'
import type { AuthDeliveryResult, AuthTokenPayload, MutationResolvers } from '@src/graphql/gql-types.js'
import { BackendError, type AuthDeliveryResultSummary, IS_APP_PRODUCTION, parseOrThrow, type RawAuthTokenPayload, REFRESH_TOKEN_COOKIE, REFRESH_TOKEN_PATH, throwError, unwrapOrThrow, INDEXATION_JOB_NAMES } from '@aromi/shared'

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

    parseOrThrow(LogInSchema, input)

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
      throw new BackendError(
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

    parseOrThrow(SignUpSchema, input)

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

    parseOrThrow(ConfirmSignUpSchema, input)

    const { email } = input
    const { queues, services } = context

    const { indexations } = queues
    const { auth, users } = services

    const username = generateFromEmail(email)

    const { sub } = await unwrapOrThrow(auth.confirmSignUp(input))
    const user = await unwrapOrThrow(users.createOne({ email, username, cognitoSub: sub }))

    await indexations.enqueue({
      jobName: INDEXATION_JOB_NAMES.INDEX_USER,
      data: { userId: user.id }
    })

    return user
  }

  resendSignUpCode: MutationResolvers['resendSignUpCode'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args

    parseOrThrow(ResendSignUpCodeSchema, input)

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

    parseOrThrow(ForgotPasswordSchema, input)

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

    parseOrThrow(ConfirmForgotPasswordSchema, input)

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
