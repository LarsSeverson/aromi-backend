import { ApiError } from '@src/common/error'
import { type MutationLogInArgs, type MutationResolvers } from '@src/generated/gql-types'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string({ required_error: 'Email is required' })
    .email('Please enter a valid email address'),
  password: z.string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters long')
})

const parseLogInInput = (args: MutationLogInArgs): void => {
  const parsed = loginSchema.safeParse(args)

  if (!parsed.success) throw new ApiError('INVALID_INPUT', parsed.error.issues[0].message, 400)
}

export const logIn: MutationResolvers['logIn'] = async (parent, args, context, info) => {
  parseLogInInput(args)

  const { email, password } = args
  const { res, services } = context
  const { auth } = services

  const result = await auth.logIn({ email, password })

  return result.match(
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
