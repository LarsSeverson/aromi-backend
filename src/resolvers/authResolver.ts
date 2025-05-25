import { type MutationResolvers } from '@src/generated/gql-types'
import { ApiResolver } from './apiResolver'
import { z } from 'zod'
import { parseSchema } from '@src/common/schema'

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
    const { req, services } = context
    const { auth } = services

    const old = req.cookies.refreshToken as (string | undefined)

    if (old == null) {
      return null
    }

    const result = await auth.refresh({ old })

    return result.match(
      (tokens) => {
        const { idToken, accessToken, expiresIn } = tokens
        const now = Math.floor(Date.now() / 1000)
        return { idToken, accessToken, expiresAt: now + expiresIn }
      },
      _ => null
    )
  }

  logIn: MutationResolvers['logIn'] = async (parent, args, context, info) => {
    parseSchema(loginSchema, args)

    const { email, password } = args
    const { res, services } = context
    const { auth } = services

    const result = await auth.logIn({ email, password })

    return result
      .match(
        (tokens) => {
          const { idToken, accessToken, refreshToken, expiresIn } = tokens
          const now = Math.floor(Date.now() / 1000)

          res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',
            maxAge: 90 * 24 * 60 * 60 * 1000 // 90 days
          })

          return { idToken, accessToken, expiresAt: now + expiresIn }
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

    const result = await auth.signUp({ email, password })

    return result
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
    const { auth } = services

    const result = await auth.confirmSignUp({ email, confirmationCode })

    return result
      .match(
        _ => true,
        error => { throw error }
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
}
