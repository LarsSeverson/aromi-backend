import { type MutationResolvers } from '@src/generated/gql-types'
import { ApiResolver } from './apiResolver'
import { z } from 'zod'
import { parseSchema } from '@src/common/schema'
import { mapUserRowToUserSummary } from './userResolver'
import { type Response } from 'express'

const loginSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Please enter a valid email address'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long')
  })

const signUpSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Please enter a valid email address'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long')
  })

const confirmSignUpSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Please enter a valid email address'),
    confirmationCode: z
      .string({ required_error: 'Code is required' })
      .length(6)
      .regex(/^\d{6}$/, 'Code must be a 6-digit number')
  })

export class AuthResolver extends ApiResolver {
  refresh: MutationResolvers['refresh'] = async (parent, args, context, info) => {
    const { req, res, services } = context
    const { auth } = services

    const old = req.cookies.refreshToken as (string | undefined)

    if (old == null) return null

    return await auth
      .refresh({ old })
      .match(
        (tokens) => {
          const { idToken, accessToken, refreshToken, accExpiresIn, refMaxAge } = tokens
          this.signRefreshCookie(refreshToken, refMaxAge, res)
          return { idToken, accessToken, expiresIn: accExpiresIn }
        },
        _ => null
      )
  }

  logIn: MutationResolvers['logIn'] = async (parent, args, context, info) => {
    parseSchema(loginSchema, args)

    const { email, password } = args
    const { res, services } = context
    const { auth, user } = services

    return await auth
      .logIn({ email, password })
      .andThen(tokens => user
        .find({ email }) // Possible to have a healing side effect of creating the user if they exist in cog but not db
        .map(_ => tokens)
      )
      .match(
        (tokens) => {
          const { idToken, accessToken, refreshToken, accExpiresIn, refMaxAge } = tokens
          this.signRefreshCookie(refreshToken, refMaxAge, res)
          return { idToken, accessToken, expiresIn: accExpiresIn }
        },
        error => { throw error }
      )
  }

  logOut: MutationResolvers['logOut'] = async (parent, args, context, info) => {
    const { res, services } = context
    const { auth } = services

    const result = await auth.logOut()

    return result
      .match(
        () => {
          res.clearCookie('refreshToken', {
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
          })

          return true
        },
        error => { throw error }
      )
  }

  signUp: MutationResolvers['signUp'] = async (parent, args, context, info) => {
    parseSchema(signUpSchema, args)

    const { email, password } = args
    const { services } = context
    const { auth } = services

    return await auth
      .signUp({ email, password })
      .match(
        cogOutput => {
          const { UserConfirmed, CodeDeliveryDetails } = cogOutput
          const complete = UserConfirmed ?? false
          const delivery = CodeDeliveryDetails != null
            ? {
                attribute: CodeDeliveryDetails.AttributeName,
                destination: CodeDeliveryDetails.Destination,
                method: CodeDeliveryDetails.DeliveryMedium
              }
            : undefined

          return {
            complete,
            delivery
          }
        },
        error => { throw error }
      )
  }

  confirmSignUp: MutationResolvers['confirmSignUp'] = async (parent, args, context, info) => {
    parseSchema(confirmSignUpSchema, args)

    const { email, confirmationCode } = args
    const { services } = context
    const { auth, user } = services

    return await auth
      .confirmSignUp({ email, confirmationCode })
      .andThen(sub => user.create({ email, cognitoId: sub }))
      .match(
        mapUserRowToUserSummary,
        error => {
          console.log(error)
          throw error
        }
      )
  }

  forgotPassword: MutationResolvers['forgotPassword'] = async (parent, args, context, info) => {
    const { email } = args
    const { services } = context
    const { auth } = services

    const result = await auth.forgotPassword({ email })

    return result
      .match(
        () => true,
        error => { throw error }
      )
  }

  confirmForgotPassword: MutationResolvers['confirmForgotPassword'] = async (parent, args, context, info) => {
    const { email, confirmationCode, newPassword } = args
    const { services } = context
    const { auth } = services

    const result = await auth.confirmForgotPassword({ email, confirmationCode, newPassword })

    return result
      .match(
        () => true,
        error => { throw error }
      )
  }

  resendSignUpConfirmationCode: MutationResolvers['resendSignUpConfirmationCode'] = async (parent, args, context, info) => {
    const { email } = args
    const { services } = context
    const { auth } = services

    const result = await auth.resendSignUpConfirmationCode({ email })

    return result
      .match(
        _ => true,
        error => { throw error }
      )
  }

  private signRefreshCookie (
    token: string,
    maxAge: number,
    res: Response
  ): void {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge
    })
  }
}
